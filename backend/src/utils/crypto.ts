import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function hashValue(value: string) {
  return bcrypt.hash(value, 12);
}

export async function compareValue(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}

export function createRandomToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
