import { Schema, model, type InferSchemaType, Types } from 'mongoose';
import { ROLE_KEYS } from '../constants/roles.js';
import { compareValue } from '../utils/crypto.js';

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, default: '', trim: true },
    phoneNumber: { type: String, default: '', trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    roleKey: { type: String, required: true, enum: Object.values(ROLE_KEYS), default: ROLE_KEYS.USER },
    permissions: [{ type: String, default: [] }],
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
    avatarUrl: { type: String, default: '' },
    lastLoginAt: { type: Date },
    refreshTokenHash: { type: String, default: '' },
    passwordResetTokenHash: { type: String, default: '' },
    passwordResetExpiresAt: { type: Date }
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.passwordResetTokenHash;
    return ret;
  }
});

userSchema.methods.comparePassword = function comparePassword(password: string) {
  return compareValue(password, this.passwordHash);
};

export type IUser = InferSchemaType<typeof userSchema>;
export interface IUserDocument extends IUser {
  _id: Types.ObjectId;
  comparePassword(password: string): Promise<boolean>;
}
export const User = model('User', userSchema);
