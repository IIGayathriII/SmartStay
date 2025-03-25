"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../../components/ui/alert";

interface HostelDetails {
  hostelId: string;
  name: string;
  address: string;
  gender: string;
  hasMess: boolean;
  maxDistFromCollege: number;
  rentPerMonth: number;
  capacity: number;
  curfewTimings: string;
  approved: boolean;
  lender: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    proofOfIdentification: string;
  };
}

export default function AdminHostelDetails() {
  const router = useRouter();
  const params = useParams<{ hostelId: string }>();
  const [hostel, setHostel] = useState<HostelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const response = await fetch(`/api/admin/hostels/${params.hostelId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setHostel(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load hostel");
      } finally {
        setLoading(false);
      }
    };

    if (params.hostelId) fetchHostel();
  }, [params.hostelId]);

  const handleApproval = async (approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/hostels/${params.hostelId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });

      if (!response.ok) throw new Error("Failed to update approval status");
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <Card className="max-w-4xl mx-auto p-8">
          <Skeleton className="h-8 w-3/4 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen p-8">
        <Alert variant="default">
          <AlertDescription>Hostel not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isImageFile = hostel.lender.proofOfIdentification?.match(/\.(jpg|jpeg|png|gif)$/i);

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-3xl">{hostel.name}</CardTitle>
            <Badge variant={hostel.approved ? "default" : "secondary"}>
              {hostel.approved ? "Approved" : "Pending Approval"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Hostel Details</h2>
              <DetailItem label="Address" value={hostel.address} />
              <DetailItem label="Gender" value={hostel.gender} />
              <DetailItem label="Capacity" value={hostel.capacity.toString()} />
              <DetailItem label="Rent" value={`₹${hostel.rentPerMonth}/month`} />
              <DetailItem label="Curfew" value={hostel.curfewTimings} />
              <DetailItem label="Distance from College" value={`${hostel.maxDistFromCollege} mins`} />
              <DetailItem label="Mess Facility" value={hostel.hasMess ? "Available" : "Not Available"} />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Lender Details</h2>
              <DetailItem label="Name" value={`${hostel.lender.firstName} ${hostel.lender.lastName}`} />
              <DetailItem label="Email" value={hostel.lender.email} />
              <DetailItem label="Phone" value={hostel.lender.phoneNumber} />
              
              <div className="mb-4">
                <Label>ID Proof</Label>
                {hostel.lender.proofOfIdentification ? (
                  <div className="mt-1 space-y-2">
                    <a
                      href={hostel.lender.proofOfIdentification}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Document
                    </a>
                    {isImageFile && (
                      <div className="mt-2 border rounded-md p-2">
                        <img 
                          src={hostel.lender.proofOfIdentification} 
                          alt="ID Proof" 
                          className="max-w-full h-auto max-h-60 object-contain"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">No ID proof uploaded</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            {!hostel.approved && (
              <Button onClick={() => handleApproval(true)}>
                Approve Hostel
              </Button>
            )}
            {hostel.approved && (
              <Button variant="destructive" onClick={() => handleApproval(false)}>
                Unapprove Hostel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <p className="mt-1">{value}</p>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-medium text-muted-foreground">{children}</p>
  );
}