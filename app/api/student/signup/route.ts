import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, mobileNumber } = await req.json();

    // Validate input
    if (!firstName || !lastName || !email || !password || !mobileNumber) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        mobileNumber,
      },
    });

    return NextResponse.json(
      { 
        message: "Signup successful", 
        student: {
          email: student.email,
          firstName: student.firstName,
          lastName: student.lastName
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.log("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}