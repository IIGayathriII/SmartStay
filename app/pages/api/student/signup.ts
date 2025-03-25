// pages/api/student/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { firstName, lastName, email, password, mobileNumber } = req.body;

  try {
    const existingStudent = await prisma.student.findUnique({ where: { email } });
    if (existingStudent) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        mobileNumber
      }
    });
    console.log('Student signed up successfully');
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}