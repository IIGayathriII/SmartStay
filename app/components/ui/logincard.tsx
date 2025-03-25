"use client"

import React from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "./card"
  
  import { Input } from "./input"
  import { Label } from "./label"

   import { Button } from "./button"
  export default function CardWithForm() {
    return (
        <div className="flex items-center justify-center px-3 min-h-screen bg-gray-100 dark:bg-gray-900">
    
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
            Login
          </Button>
          
          
                <Label className="text-left">Don't have an account?</Label>
                  <Button variant="outline" className="w-full">Sign up</Button>
                  
                </CardFooter>
              </Card>
      
    </div>
    )
  }