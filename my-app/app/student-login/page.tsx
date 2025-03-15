"use client";
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

export default function StudentLogin() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Enter your username" />
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
            <Link href="/Invite-code">Login</Link>
          </Button>
          <Label className="text-left">Don't have an account?</Label>
          <Button variant="outline" className="w-full">
            <Link href="/student-signup">Sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}