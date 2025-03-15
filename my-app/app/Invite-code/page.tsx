"use client";
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

export default function InviteCode() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-hsl(0, 0%, 100%)">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Enter Invite Code</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="invite-code">Invite Code</Label>
                <Input id="invite-code" placeholder="Enter the invite code here" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full">
            <Link href="/student-dashboard">Submit</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}