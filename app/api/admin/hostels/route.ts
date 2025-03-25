// app/api/admin/hostels/route.ts
import { NextResponse } from "next/server";
import prisma from "./../../../lib/db";

export async function GET() {
  const hostels = await prisma.hostel.findMany({
    include: { lender: true }
  });
  return NextResponse.json(hostels);
}

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const hostelId = searchParams.get("hostelId");
  const { approved } = await req.json();

  const updatedHostel = await prisma.hostel.update({
    where: { hostelId: hostelId! },
    data: { approved }
  });

  return NextResponse.json(updatedHostel);
}