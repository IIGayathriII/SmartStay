import React, { ReactNode } from "react";


interface GridBackgroundDemoProps {

    children: ReactNode;
  
  }
  
export function GridBackgroundDemo({ children }: GridBackgroundDemoProps) {
  return (
    <div className=" dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      
       {children}
    </div>
  );
}
