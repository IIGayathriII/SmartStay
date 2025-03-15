"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { CreationSubmit } from "./SubmitButtons";
import { Card, CardHeader } from "./card";
import { Switch } from "./switch";
import { Slider } from "./slider";
import { Label } from "./label";

export function HostelSearchModal() {
  const [isGirlsHostel, setIsGirlsHostel] = useState(false);
  const [foodOption, setFoodOption] = useState(false);
  const [distanceFromCollege, setDistanceFromCollege] = useState(15);
  const [curfewTiming, setCurfewTiming] = useState("10:00 PM");
  const [rentPerMonth, setRentPerMonth] = useState(5000);
  const [roomCapacity, setRoomCapacity] = useState(2);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full max-w-2xl bg-white shadow-md h-14 rounded-full flex justify-between text-sm">
          {/* Hostel Type section */}
          <div className="w-1/3 rounded-l-full p-2 px-5 transition-all duration-200 relative hover:bg-gray-100 flex flex-col justify-center">
            <p className="font-medium text-gray-700">Hostel Type</p>
            <p className="text-gray-500 text-xs">
              {isGirlsHostel ? "Girls Hostel" : "Boys Hostel"}
            </p>
          </div>
          
          {/* Budget section */}
          <div className="w-1/3 p-2 px-5 transition-all duration-200 relative hover:bg-gray-100 flex flex-col justify-center
            before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-px before:h-3/5 before:bg-gray-200">
            <p className="font-medium text-gray-700">Budget</p>
            <p className="text-gray-500 text-xs">₹{rentPerMonth}/month</p>
          </div>
          
          {/* Filters section with search button */}
          <div className="w-1/3 rounded-r-full p-2 px-5 transition-all duration-200 relative hover:bg-gray-100 flex flex-col justify-center
            before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-px before:h-3/5 before:bg-gray-200">
            <p className="font-medium text-gray-700">Filters</p>
            <p className="text-gray-500 text-xs">{roomCapacity} person room</p>
            <span className="absolute top-1/2 right-4 -translate-y-1/2 bg-primary text-white text-xs p-2.5 rounded-full flex items-center justify-center">
              <Search size={16} />
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form className="gap-4 flex flex-col">
          <input type="hidden" name="isGirlsHostel" value={isGirlsHostel.toString()} />
          <input type="hidden" name="foodOption" value={foodOption.toString()} />
          <input type="hidden" name="distanceFromCollege" value={distanceFromCollege.toString()} />
          <input type="hidden" name="curfewTiming" value={curfewTiming} />
          <input type="hidden" name="rentPerMonth" value={rentPerMonth.toString()} />
          <input type="hidden" name="roomCapacity" value={roomCapacity.toString()} />
          
          <DialogHeader>
            <DialogTitle>Hostel Search Filters</DialogTitle>
            <DialogDescription>
              Set your preferences to find the perfect hostel
            </DialogDescription>
          </DialogHeader>

          <Card>
            <CardHeader className="flex flex-col gap-y-5">
              {/* Hostel Type */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="font-medium">Hostel Type</h3>
                  <p className="text-muted-foreground text-sm">
                    Girls Hostel
                  </p>
                </div>
                <Switch
                  checked={isGirlsHostel}
                  onCheckedChange={setIsGirlsHostel}
                  name="isGirlsHostel"
                />
              </div>
              
              {/* Food Option */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="font-medium">Mess Facilities</h3>
                  <p className="text-muted-foreground text-sm">
                    Food services available
                  </p>
                </div>
                <Switch
                  checked={foodOption}
                  onCheckedChange={setFoodOption}
                  name="foodOption"
                />
              </div>
              
              {/* Distance from College */}
              <div className="flex flex-col gap-2">
                <div>
                  <Label htmlFor="distance" className="font-medium">Distance from College</Label>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Walking time</span>
                    <span className="text-sm font-medium">{distanceFromCollege} minutes</span>
                  </div>
                </div>
                <Slider
                  id="distance"
                  value={[distanceFromCollege]}
                  onValueChange={(values) => setDistanceFromCollege(values[0])}
                  min={1}
                  max={30}
                  step={1}
                />
              </div>
              
              {/* Curfew Timing */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="curfew" className="font-medium">Curfew Timing</Label>
                <Select
                  value={curfewTiming}
                  onValueChange={setCurfewTiming}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select curfew time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">No Curfew</SelectItem>
                    <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                    <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                    <SelectItem value="10:00 PM">10:00 PM</SelectItem>
                    <SelectItem value="11:00 PM">11:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Rent Per Month */}
              <div className="flex flex-col gap-2">
                <div>
                  <Label htmlFor="rent" className="font-medium">Monthly Rent</Label>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Budget</span>
                    <span className="text-sm font-medium">₹{rentPerMonth}</span>
                  </div>
                </div>
                <Slider
                  id="rent"
                  value={[rentPerMonth]}
                  onValueChange={(values) => setRentPerMonth(values[0])}
                  min={2000}
                  max={15000}
                  step={500}
                />
              </div>
              
              {/* Room Capacity */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="capacity" className="font-medium">Room Capacity</Label>
                <Select
                  value={roomCapacity.toString()}
                  onValueChange={(value) => setRoomCapacity(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Students per room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Single (1 person)</SelectItem>
                    <SelectItem value="2">Double (2 people)</SelectItem>
                    <SelectItem value="3">Triple (3 people)</SelectItem>
                    <SelectItem value="4">Quad (4 people)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
          </Card>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              className="mr-2"
              onClick={() => {
                // Reset all filters
                setIsGirlsHostel(false);
                setFoodOption(false);
                setDistanceFromCollege(15);
                setCurfewTiming("10:00 PM");
                setRentPerMonth(5000);
                setRoomCapacity(2);
              }}
            >
              Reset
            </Button>
            <CreationSubmit />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}