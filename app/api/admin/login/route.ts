import { NextResponse } from 'next/server'
import prisma from '../../../lib/db'
import { createSession } from '@/lib/session'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log("Login attempt for:", email);
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      console.log("Admin not found");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const passwordValid = await bcrypt.compare(password, admin.password);
    if (!passwordValid) {
      console.log("Password invalid");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    await createSession(email, 'admin');
    console.log("Session created for:", email);
    return NextResponse.json({
      message: "Login successful",
      admin: { email: admin.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}