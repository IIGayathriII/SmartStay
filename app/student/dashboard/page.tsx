"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../components/ui/alert";

interface Hostel {
  hostelId: string;
  name: string;
  gender: string;
  hasMess: boolean;
  maxDistFromCollege: number;
  rentPerMonth: number;
  capacity: number;
  curfewTimings: string;
  address: string;
}

export default function StudentDashboard() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await fetch("/api/hostels");
        if (!response.ok) throw new Error("Failed to fetch hostels");
        
        const data = await response.json();
        setHostels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load hostels");
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>Error: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Available Hostels
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map((hostel) => (
              <Link key={hostel.hostelId} href={`/student/hostels/${hostel.hostelId}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{hostel.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant={
                        hostel.gender === 'male' ? 'secondary' :
                        hostel.gender === 'female' ? 'secondary' : 'outline'
                      }>
                        {hostel.gender}
                      </Badge>
                      <Badge variant={hostel.hasMess ? 'default' : 'destructive'}>
                        {hostel.hasMess ? 'Mess Available' : 'No Mess'}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distance:</span>
                        <span>{hostel.maxDistFromCollege} mins</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rent:</span>
                        <span>₹{hostel.rentPerMonth}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span>{hostel.capacity} people</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Curfew:</span>
                        <span>{hostel.curfewTimings}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && hostels.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No approved hostels available at the moment
          </div>
        )}
      </div>
    </div>
  );
}