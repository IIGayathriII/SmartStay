"use client";
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

export default function StudentSignup() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="Enter your first name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Enter your last name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Enter your email" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="Enter your password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full">
            <Link href="/invite-code">Sign Up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

