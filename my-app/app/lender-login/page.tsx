"use client"
import Link from "next/link";
import React from "react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../components/ui/card"
  
  import { Input } from "../components/ui/input"
  import { Label } from "../components/ui/label"
  import { GridBackgroundDemo } from "../components/ui/GridBackground";
   import { Button } from "../components/ui/button"
  export default function CardWithForm() {
    return (
        
        <div className="flex items-center justify-center px-3 min-h-screen ">
    
      <Card className="w-[350px]">
        <div className="flex items-center justify-center text-2xl font-semibold">
        <CardHeader>
          <CardTitle>Login</CardTitle>
     
        </CardHeader>
            </div>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Username</Label>
                <Input id="name" placeholder="Enter your username" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Password</Label>
                <Input id="name" placeholder="Enter your password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
         
        <Button className="w-full">
        <Link href="/lender-dashboard">
            Login
            </Link>
          </Button>
         
          
          
                <Label className="text-left">Don't have an account?</Label>
                  <Button variant="outline" className="w-full"><Link href="/lender-signup">
            Sign up
            </Link></Button>
                  
                </CardFooter>
              </Card>
      
    </div>
    
    )
  }