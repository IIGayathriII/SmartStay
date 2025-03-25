import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";

export async function POST(req: Request) {
  try {
    const { hostelId } = await req.json();
    
    // Get the logged-in student's email (replace with actual auth later)
    const studentEmail = "student@example.com";

    // Check if Student exists first
    const student = await prisma.student.findUnique({
      where: { email: studentEmail }
    });

    if (!student) {
      console.error("Student not found:", studentEmail);
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Check if Hostel exists
    const hostel = await prisma.hostel.findUnique({
      where: { hostelId }
    });

    if (!hostel) {
      console.error("Hostel not found:", hostelId);
      return NextResponse.json(
        { error: "Hostel not found" },
        { status: 404 }
      );
    }

    // Check for existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: {
        studentEmail_hostelId: {
          studentEmail,
          hostelId
        }
      }
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Booking already exists" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        studentEmail,
        hostelId,
        approved: false
      }
    });

    // Notify lender (this would be a real notification system in production)
    await notifyLender(hostelId, studentEmail);

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function notifyLender(hostelId: string, studentEmail: string) {
  try {
    const hostel = await prisma.hostel.findUnique({
      where: { hostelId },
      include: { lender: true }
    });

    if (hostel) {
      // In a real app, this would send an email or push notification
      console.log(`Notification sent to ${hostel.lender.email}: 
        Student ${studentEmail} has booked ${hostel.name}`);
    }
  } catch (error) {
    console.error("Notification error:", error);
    // Continue processing - don't fail the booking if notification fails
  }
}