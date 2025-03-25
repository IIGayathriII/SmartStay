"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Checkbox } from "../../../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export default function NewHostelPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    curfewTimings: "10:00 PM",
    advancePayment: "",
    rentPerMonth: "",
    capacity: "2",
    hasMess: false,
    maxDistFromCollege: "15",
    gender: "male",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/lender/hostels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          curfewTimings: formData.curfewTimings,
          advancePayment: parseFloat(formData.advancePayment),
          rentPerMonth: parseFloat(formData.rentPerMonth),
          capacity: parseInt(formData.capacity),
          hasMess: formData.hasMess,
          maxDistFromCollege: parseInt(formData.maxDistFromCollege),
          gender: formData.gender,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create hostel");
      }

      router.push("/lender/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create hostel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Hostel</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hostel Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="advancePayment">Advance Payment (₹)</Label>
                <Input
                  id="advancePayment"
                  type="number"
                  min="0"
                  required
                  value={formData.advancePayment}
                  onChange={(e) => setFormData({ ...formData, advancePayment: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rentPerMonth">Monthly Rent (₹)</Label>
                <Input
                  id="rentPerMonth"
                  type="number"
                  min="0"
                  required
                  value={formData.rentPerMonth}
                  onChange={(e) => setFormData({ ...formData, rentPerMonth: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distance">Distance from College (mins)</Label>
                <Input
                  id="distance"
                  type="number"
                  min="0"
                  required
                  value={formData.maxDistFromCollege}
                  onChange={(e) => setFormData({ ...formData, maxDistFromCollege: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Curfew Time</Label>
                <Select
                  value={formData.curfewTimings}
                  onValueChange={(value) => setFormData({ ...formData, curfewTimings: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select curfew time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10:00 PM">10:00 PM</SelectItem>
                    <SelectItem value="11:00 PM">11:00 PM</SelectItem>
                    <SelectItem value="12:00 AM">12:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasMess"
                checked={formData.hasMess}
                onCheckedChange={(checked) => setFormData({ ...formData, hasMess: !!checked })}
              />
              <Label htmlFor="hasMess">Has Mess Facility</Label>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating Hostel..." : "Create Hostel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}