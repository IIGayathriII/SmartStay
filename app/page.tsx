"use client"

import { motion } from "framer-motion";
import { AuroraBackground } from "./components/ui/aurora-background";
import Link from "next/link";
import React from "react";
//import { useRouter } from 'next/router';


export default function AuroraBackgroundDemo() {

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-7"
      >
        <div className="text-6xl md:text-7xl font-bold dark:text-white text-center">
          Welcome to SmartStay
        </div>
        <div className=" text text-center text-5xl text font-light dark:text-neutral-200 py-6">
          Explore hostels virtually!
        </div>
        <div className="flex flex-col items-center md:flex-row gap-4">
          <Link href="/student/login">
            <button className="bg-transparent dark:bg-black rounded-full w-fit text-black dark:text-white px-4 py-2 text-base md:text-base border border-black dark:border-white hover:bg-lavender hover:border-black hover:shadow-lg hover:shadow-lavender hover:scale-105 transition-transform">
              Explore Hostels
            </button>
          </Link>
          <Link href="/lender/login">
            <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2 text-base md:px-4 md:py-2 md:text-base hover:bg-lavender hover:border-black hover:shadow-lg hover:shadow-lavender hover:scale-105 transition-transform">
              List Your Property
            </button>
          </Link>
        </div>
        <Link href="/admin/login">
        <div
            className="text-base underline md:text-base text-black dark:text-white hover:underline disapper"
          >
            Login as Admin
          </div>
        </Link>
      </motion.div>
    </AuroraBackground>
  );
}

