
import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export async function GET() {
  try {
    const hostels = await prisma.hostel.findMany({
      where: { approved: true },
      select: {
        hostelId: true,
        name: true,
        gender: true,
        hasMess: true,
        maxDistFromCollege: true,
        rentPerMonth: true,
        capacity: true,
        curfewTimings: true,
        address: true
      }
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