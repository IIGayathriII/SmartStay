import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";

export async function GET(req: Request, { params }: { params: { hostelId: string } }) {
  try {
    const hostel = await prisma.hostel.findUnique({
      where: { hostelId: params.hostelId },
      include: { 
        lender: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            proofOfIdentification: true
          }
        } 
      }
    });

    if (!hostel) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    return NextResponse.json(hostel);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch hostel" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: { hostelId: string } }) {
  try {
    const { approved } = await req.json();
    
    const updatedHostel = await prisma.hostel.update({
      where: { hostelId: params.hostelId },
      data: { approved }
    });

    return NextResponse.json(updatedHostel);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update hostel" },
      { status: 500 }
    );
  }
}