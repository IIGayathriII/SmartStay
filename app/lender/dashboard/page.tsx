"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../components/ui/alert";

interface Hostel {
  hostelId: string;
  name: string;
  address: string;
  rentPerMonth: number;
  approved: boolean;
}

export default function LenderDashboard() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await fetch("/api/lender/hostels");
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch hostels");

        setHostels(data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load hostels");
        setHostels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Hostels</h1>
          <Link href="/lender/hostels/new">
            <Button>
              Add New Hostel
            </Button>
          </Link>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map((hostel) => (
              <Link key={hostel.hostelId} href={`/lender/hostels/${hostel.hostelId}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{hostel.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{hostel.address}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">₹{hostel.rentPerMonth}/month</span>
                      <Badge variant={hostel.approved ? "default" : "secondary"}>
                        {hostel.approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && hostels.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No hostels found. Create your first hostel!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}