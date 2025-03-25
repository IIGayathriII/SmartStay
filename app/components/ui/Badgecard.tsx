"use client"
import React from 'react';
import { HeartIcon, Clock, MapPin, Users, Coffee, Coins } from 'lucide-react';

// TypeScript interfaces
interface Badge {
  icon: React.ReactNode;
  label: string;
}

interface HostelData {
  image: string;
  title: string;
  isGirlsHostel: boolean;
  description: string;
  foodOption: boolean;
  distanceFromCollege: number;
  curfewTiming: string;
  rentPerMonth: number;
  roomCapacity: number;
}

// Sample mock data
const mockdata: HostelData = {
  image:
    '/api/placeholder/600/400',
  title: 'Lakeside Hostel',
  isGirlsHostel: true,
  description:
    'Modern hostel with well-furnished rooms, high-speed WiFi, 24/7 security, and a peaceful environment perfect for studying. Located near public transport with easy access to shopping areas.',
  foodOption: true,
  distanceFromCollege: 15,
  curfewTiming: '10:00 PM',
  rentPerMonth: 12000,
  roomCapacity: 2,
};

const HostelBadgeCard: React.FC = () => {
  const { image, title, isGirlsHostel, description, foodOption, distanceFromCollege, curfewTiming, rentPerMonth, roomCapacity } = mockdata;

  // Create badges from hostel data
  const badges: Badge[] = [
    { 
      icon: <Users className="h-4 w-4" />,
      label: `${isGirlsHostel ? 'Girls' : 'Boys'} Hostel` 
    },
    { 
      icon: <Coffee className="h-4 w-4" />,
      label: foodOption ? 'Mess Available' : 'No Mess' 
    },
    { 
      icon: <MapPin className="h-4 w-4" />,
      label: `${distanceFromCollege} mins from college` 
    },
    { 
      icon: <Clock className="h-4 w-4" />,
      label: `Curfew: ${curfewTiming}` 
    },
    { 
      icon: <Coins className="h-4 w-4" />,
      label: `₹${rentPerMonth.toLocaleString()}/month` 
    },
    { 
      icon: <Users className="h-4 w-4" />,
      label: `${roomCapacity} per room` 
    },
  ];

  return (
    <div className="max-w-md rounded-lg border border-gray-200 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div>
        <img src={image} alt={title} className="h-48 w-full rounded-t-lg object-cover" />
      </div>
      
      <div className="border-b border-gray-200 px-4 pb-4 pt-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          <span className={`rounded-full px-2 py-1 text-xs font-medium text-white ${isGirlsHostel ? 'bg-pink-500' : 'bg-blue-500'}`}>
            {isGirlsHostel ? 'Girls Hostel' : 'Boys Hostel'}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
      
      <div className="border-b border-gray-200 px-4 pb-4 dark:border-gray-700">
        <p className="mt-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
          Hostel Details
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium dark:bg-gray-700"
            >
              <span className="mr-1">{badge.icon}</span>
              {badge.label}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex px-4 py-4">
        <button className="flex-1 rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600">
          View Details
        </button>
        <button className="ml-2 flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700">
          <HeartIcon className="h-5 w-5 text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default HostelBadgeCard;