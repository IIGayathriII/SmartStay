"use client";
import React from "react";
import RealEstateCard from "../components/ui/Hostelcard";
import {HostelSearchModal} from "../components/ui/Searchbarairbnb";
import HostelBadgeCard from "../components/ui/Badgecard";
import Link from "next/link";

export default function StudentDashboard() {
  return (
    <>
      <div className="p-6">
        <HostelSearchModal />
      </div>
      <div className="p-8 flex justify-center">
      <div className="grid grid-cols-1 min-[700px]:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 justify-center">

  <Link href="/hostel-info">
    
      <HostelBadgeCard />
    
  </Link>
          <HostelBadgeCard />
          <HostelBadgeCard />
          <HostelBadgeCard />
          <HostelBadgeCard />
          <HostelBadgeCard />
          <HostelBadgeCard />
        </div>
      </div>
    </>
  );
}
