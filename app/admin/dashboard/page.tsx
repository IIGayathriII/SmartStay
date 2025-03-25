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
  approved: boolean;
  lender: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await fetch("/api/admin/hostels");
        const data = await response.json();
        setHostels(data);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  const approvedHostels = hostels.filter(h => h.approved);
  const pendingHostels = hostels.filter(h => !h.approved);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Hostel Approvals</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Pending Approval ({pendingHostels.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingHostels.map(hostel => (
                  <HostelCard key={hostel.hostelId} hostel={hostel} />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Approved Hostels ({approvedHostels.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedHostels.map(hostel => (
                  <HostelCard key={hostel.hostelId} hostel={hostel} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function HostelCard({ hostel }: { hostel: Hostel }) {
  return (
    <Link href={`/admin/hostels/${hostel.hostelId}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl">{hostel.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{hostel.address}</p>
          <div className="flex items-center justify-between">
            <Badge variant={hostel.approved ? "default" : "secondary"}>
              {hostel.approved ? "Approved" : "Pending"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {hostel.lender.firstName} {hostel.lender.lastName}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}