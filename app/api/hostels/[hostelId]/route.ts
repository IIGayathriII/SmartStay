import { NextResponse } from "next/server";
import prisma from "../../../lib/db";
import { parse } from "cookie";

export async function GET(
  req: Request,
  { params }: { params: { hostelId: string } }
) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    const session = cookies.session ? JSON.parse(cookies.session) : null;

    if (!session || !session.email || session.role !== "lender") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hostel = await prisma.hostel.findUnique({
      where: { hostelId: params.hostelId },
      include: { lender: true },
    });

    if (!hostel) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    // Ensure the hostel belongs to the logged-in lender
    if (hostel.lenderEmail !== session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      hostelId: hostel.hostelId,
      name: hostel.name,
      gender: hostel.gender,
      hasMess: hostel.hasMess,
      maxDistFromCollege: hostel.maxDistFromCollege,
      rentPerMonth: hostel.rentPerMonth,
      capacity: hostel.capacity,
      curfewTimings: hostel.curfewTimings,
      address: hostel.address,
      advancePayment: hostel.advancePayment,
      lender: {
        firstName: hostel.lender.firstName,
        lastName: hostel.lender.lastName,
        phoneNumber: hostel.lender.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error fetching hostel details:", error);
    return NextResponse.json(
      { error: "Failed to fetch hostel details" },
      { status: 500 }
    );
  }
}