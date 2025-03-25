import { NextResponse } from "next/server";
import prisma from "../../../../lib/db"; // Adjust the import path based on your project structure
import { parse } from "cookie";

export async function GET(req: Request, { params }: { params: { hostelId: string } }) {
  try {
    // Parse cookies to extract session data
    const cookies = parse(req.headers.get("cookie") || "");
    const session = cookies.session ? JSON.parse(cookies.session) : null;

    // Verify that the user is authenticated and has the lender role
    if (!session || !session.email || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch hostel details from the database, ensuring it belongs to the lender
    const hostel = await prisma.hostel.findFirst({
      where: {
        hostelId: params.hostelId,
        lenderEmail: session.email,
      },
      include: {
        lender: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    // If no hostel is found or it doesn't belong to the lender, return 404
    if (!hostel) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    // Return the hostel details
    return NextResponse.json(hostel);
  } catch (error) {
    console.error("Error fetching hostel:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}