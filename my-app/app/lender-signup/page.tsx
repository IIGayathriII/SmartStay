"use client"
import Link from "next/link";
import React from "react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
  } from "../components/ui/card"
  
  import { Input } from "../components/ui/input"
  import { Label } from "../components/ui/label"
  import { GridBackgroundDemo } from "../components/ui/GridBackground";
   import { Button } from "../components/ui/button"
  export default function CardWithForm() {
    return (
        <GridBackgroundDemo>
        <div className="flex items-center justify-center px-3 min-h-screen ">
    
      <Card className="w-[350px]">
        <div className="flex items-center justify-center text-2xl font-semibold">
        <CardHeader>
          <CardTitle>Enter your details</CardTitle>
     
        </CardHeader>
            </div>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">First Name</Label>
                <Input id="name" placeholder="Enter your first name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Last Name</Label>
                <Input id="name" placeholder="Enter your last name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Address</Label>
                <Input id="name" placeholder="Enter your address" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Phone number</Label>
                <Input id="name" placeholder="Enter your phone number" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
         
        <Button className="w-full">
        <Link href="/lender-dashboard">
            Submit
            </Link>
          </Button>
         
          
          
             
                  
                </CardFooter>
              </Card>
      
    </div>
    </GridBackgroundDemo>
    )
  }