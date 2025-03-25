import { NextResponse } from "next/server";
import prisma from "../../../lib/db";
import { parse } from "cookie";

// Fetch all hostels for the logged-in lender
export async function GET(req: Request) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    const session = cookies.session ? JSON.parse(cookies.session) : null;

    // Check if the user is authenticated and a lender
    if (!session || !session.email || session.role !== "lender") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hostels = await prisma.hostel.findMany({
      where: { lenderEmail: session.email },
      select: {
        hostelId: true,
        name: true,
        address: true,
        rentPerMonth: true,
        approved: true,
      },
    });

    return NextResponse.json(hostels);
  } catch (error) {
    console.error("Error fetching hostels:", error);
    return NextResponse.json(
      { error: "Failed to fetch hostels" },
      { status: 500 }
    );
  }
}

// Create a new hostel for the logged-in lender
export async function POST(req: Request) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    const session = cookies.session ? JSON.parse(cookies.session) : null;

    if (!session || !session.email || session.role !== "lender") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const newHostel = await prisma.hostel.create({
      data: {
        name: body.name,
        address: body.address,
        lenderEmail: session.email, // Use session email, not body
        curfewTimings: body.curfewTimings,
        advancePayment: body.advancePayment,
        rentPerMonth: body.rentPerMonth,
        capacity: body.capacity,
        hasMess: body.hasMess,
        maxDistFromCollege: body.maxDistFromCollege,
        gender: body.gender,
        approved: false, // Requires admin approval
      },
    });

    return NextResponse.json(newHostel, { status: 201 });
  } catch (error) {
    console.error("Error creating hostel:", error);
    return NextResponse.json(
      { error: "Failed to create hostel" },
      { status: 500 }
    );
  }
}