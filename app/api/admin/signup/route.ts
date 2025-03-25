

import { NextResponse } from "next/server";
import prisma from "../../../lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin with hashed password
    const admin = await prisma.admin.create({
      data: { email, password: hashedPassword },
    });

    return NextResponse.json(admin);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}