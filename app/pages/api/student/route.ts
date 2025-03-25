import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, mobileNumber } = await request.json();

    // Validate input
    if (!firstName || !lastName || !email || !password || !mobileNumber) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingStudent = await prisma.student.findUnique({ where: { email } });
    if (existingStudent) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

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

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}