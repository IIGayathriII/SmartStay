// pages/api/student/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/db';
import { setexAsync } from '../../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  try {
    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, student.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    // Create session
    const sessionId = require('crypto').randomBytes(16).toString('hex');
    const sessionData = {
      email: student.email,
      role: 'student',
      createdAt: Date.now()
    };

    await setexAsync(sessionId, 3600 * 24, JSON.stringify(sessionData));

    res.setHeader('Set-Cookie', `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${3600 * 24}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}