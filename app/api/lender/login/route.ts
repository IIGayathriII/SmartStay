import { NextResponse } from "next/server";
import prisma from "../../../lib/db";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Find lender by email
    const lender = await prisma.lender.findUnique({ where: { email } });
    if (!lender) {
      console.log(`Lender not found for email: ${email}`); // Debug log
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Compare password
    const passwordValid = await bcrypt.compare(password, lender.password);
    if (!passwordValid) {
      console.log(`Password invalid for email: ${email}`); // Debug log
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create session and set cookie
    const sessionCookie = await createSession(email, "lender");
    const response = NextResponse.json({
      message: "Login successful",
      lender: {
        firstName: lender.firstName,
        lastName: lender.lastName,
        email: lender.email,
      },
    });

    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.options
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}