import type { Request, Response } from 'express';
import { env } from '../config/env.js';
import { ROLE_KEYS } from '../constants/roles.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { clearAuthCookies, setAuthCookies } from '../utils/cookie.js';
import { hashToken, hashValue } from '../utils/crypto.js';
import { sendEmail } from '../services/email.service.js';
import {
  clearRefreshToken,
  createPasswordResetToken,
  createUserWithRole,
  issueTokens,
  resolveRolePermissions,
  storeRefreshToken
} from '../services/auth.service.js';

function sanitizeUser(user: any) {
  const plain = user?.toObject ? user.toObject() : user;
  delete plain.passwordHash;
  delete plain.refreshTokenHash;
  delete plain.passwordResetTokenHash;
  return plain;
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await createUserWithRole({
    fullName: req.body.fullName,
    companyName: req.body.companyName,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    password: req.body.password,
    departmentId: req.body.departmentId,
    roleKey: ROLE_KEYS.USER
  });

  const { accessToken, refreshToken } = await issueTokens(user);
  await storeRefreshToken(String(user._id), refreshToken);
  setAuthCookies(res, accessToken, refreshToken);
  res.status(201).json({ message: 'Registered successfully', user: sanitizeUser(user), accessToken, refreshToken });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const email = String(req.body.email).toLowerCase().trim();
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isValid = await user.comparePassword(req.body.password);
  if (!isValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const { accessToken, refreshToken } = await issueTokens(user);
  await storeRefreshToken(String(user._id), refreshToken);
  setAuthCookies(res, accessToken, refreshToken);
  res.json({ message: 'Logged in successfully', user: sanitizeUser(user), accessToken, refreshToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    const user = await User.findOne({ refreshTokenHash: hashToken(refreshToken) });
    if (user) {
      await clearRefreshToken(String(user._id));
    }
  }
  clearAuthCookies(res);
  res.json({ message: 'Logged out successfully' });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken ?? req.body.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token required');
  }

  const user = await User.findOne({ refreshTokenHash: hashToken(refreshToken) });
  if (!user) {
    throw new ApiError(401, 'Invalid refresh session');
  }

  const { accessToken, refreshToken: nextRefreshToken } = await issueTokens(user);
  await storeRefreshToken(String(user._id), nextRefreshToken);
  setAuthCookies(res, accessToken, nextRefreshToken);
  res.json({ accessToken, refreshToken: nextRefreshToken });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.json({ user: sanitizeUser(req.user) });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const email = String(req.body.email).toLowerCase().trim();
  const user = await User.findOne({ email });
  if (!user) {
    res.json({ message: 'If the account exists, reset instructions were sent' });
    return;
  }

  const { resetToken, resetTokenHash } = createPasswordResetToken();
  user.passwordResetTokenHash = resetTokenHash;
  user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetLink = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendEmail(user.email, 'Reset your Helpdesk password', `<p>Reset your password using this link:</p><p><a href="${resetLink}">${resetLink}</a></p>`);
  res.json({ message: 'If the account exists, reset instructions were sent' });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const tokenHash = hashToken(req.body.token);
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpiresAt: { $gt: new Date() }
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  user.passwordHash = await hashValue(req.body.password);
  user.passwordResetTokenHash = '';
  user.passwordResetExpiresAt = undefined;
  user.refreshTokenHash = '';
  await user.save();

  res.json({ message: 'Password updated successfully' });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isValid = await user.comparePassword(req.body.currentPassword);
  if (!isValid) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.passwordHash = await hashValue(req.body.newPassword);
  await user.save();
  res.json({ message: 'Password changed successfully' });
});
