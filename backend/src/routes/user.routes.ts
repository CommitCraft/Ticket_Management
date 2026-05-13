import { Router } from 'express';
import { deleteUser, getUser, listUsers, profile, updateProfile, updateUser } from '../controllers/user.controller.js';
import { protect, permitPermissions } from '../middleware/auth.js';
import { PERMISSIONS } from '../constants/roles.js';
import { validateBody } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/auth.validator.js';

export const userRouter = Router();

userRouter.get('/me', protect, profile);
userRouter.patch('/me', protect, validateBody(updateProfileSchema), updateProfile);
userRouter.get('/', protect, permitPermissions(PERMISSIONS.USER_READ), listUsers);
userRouter.get('/:id', protect, permitPermissions(PERMISSIONS.USER_READ), getUser);
userRouter.patch('/:id', protect, permitPermissions(PERMISSIONS.USER_WRITE), updateUser);
userRouter.delete('/:id', protect, permitPermissions(PERMISSIONS.USER_WRITE), deleteUser);
