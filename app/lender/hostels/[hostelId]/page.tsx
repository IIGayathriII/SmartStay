"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../../components/ui/alert";

interface HostelDetails {
  hostelId: string;
  name: string;
  gender: string;
  hasMess: boolean;
  maxDistFromCollege: number;
  rentPerMonth: number;
  capacity: number;
  curfewTimings: string;
  address: string;
  advancePayment: number;
  lender: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gpayQrCodeUrl: string;
  };
}

export default function HostelDetails() {
  const { hostelId } = useParams();
  const [hostel, setHostel] = useState<HostelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const response = await fetch(`/api/hostels/${hostelId}`);
        if (!response.ok) throw new Error("Failed to fetch hostel");
        const data = await response.json();
        setHostel(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load hostel");
      } finally {
        setLoading(false);
      }
    };
    if (hostelId) {
      fetchHostel();
    }
  }, [hostelId]);

  if (loading) return (
    <div className="min-h-screen p-8">
      <Card className="max-w-4xl mx-auto p-8">
        <Skeleton className="h-8 w-3/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  if (error) return (
    <div className="min-h-screen p-8">
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );

  if (!hostel) return (
    <div className="min-h-screen p-8">
      <Alert variant="default">
        <AlertDescription>Hostel not found</AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{hostel.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <DetailItem label="Address" value={hostel.address} />
              <DetailItem label="Curfew Timings" value={hostel.curfewTimings} />
              <DetailItem label="Advance Payment" value={`₹${hostel.advancePayment}`} />
              <DetailItem label="Rent" value={`₹${hostel.rentPerMonth}/month`} />
            </div>
            <div className="space-y-4">
              <DetailItem label="Gender" value={hostel.gender} />
              <DetailItem label="Mess" value={hostel.hasMess ? "Available" : "Not Available"} />
              <DetailItem label="Distance" value={`${hostel.maxDistFromCollege} mins`} />
              <DetailItem label="Capacity" value={`${hostel.capacity} people`} />
              <DetailItem label="Contact" value={`${hostel.lender.firstName} ${hostel.lender.lastName} - ${hostel.lender.phoneNumber}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b pb-2">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-lg">{value}</dd>
    </div>
  );
}