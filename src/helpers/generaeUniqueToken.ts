import crypto from 'crypto';

export const generateUniqueToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
