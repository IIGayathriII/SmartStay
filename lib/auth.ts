import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import redis from './redis';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const createSession = async (user: { email: string; role: string }) => {
  const sessionToken = randomBytes(32).toString('hex');
  await redis.set(sessionToken, JSON.stringify(user), { EX: 60 * 60 * 24 });
  return sessionToken;
};