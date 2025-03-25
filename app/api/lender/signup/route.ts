import { NextResponse } from "next/server";
import prisma from "../../../lib/db";
import bcrypt from "bcryptjs"; // Import bcryptjs

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Check for existing lender
    const existingLender = await prisma.lender.findUnique({
      where: { email: data.email },
    });

    if (existingLender) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create new lender with hashed password
    const lender = await prisma.lender.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        homeAddress: data.homeAddress,
        phoneNumber: data.phoneNumber,
        password: hashedPassword, // Store hashed password
        gpayQrCodeUrl: data.gpayQrCodeUrl || "",
        proofOfIdentification: data.proofOfIdentification,
      },
    });

    return NextResponse.json(
      {
        message: "Signup successful",
        lender: {
          email: lender.email,
          firstName: lender.firstName,
          lastName: lender.lastName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}