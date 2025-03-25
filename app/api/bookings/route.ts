import { NextResponse } from "next/server";
import prisma from "../../lib/db";

export async function POST(req: Request) {
  try {
    const { hostelId, studentEmail } = await req.json();
    
    const booking = await prisma.booking.create({
      data: {
        studentEmail,
        hostelId,
        approved: false,
        paymentdone: false
      }
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}