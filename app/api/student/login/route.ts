import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session'; // Ensure this is the correct path
import prisma from '../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Find student by email
    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, student.password);
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session and get cookie configuration
    const sessionCookie = await createSession(email, 'student');

    // Prepare the successful response
    const response = NextResponse.json({
      message: 'Login successful',
      student: {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      },
    });

    // Set the session cookie in the response headers
    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.options
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}