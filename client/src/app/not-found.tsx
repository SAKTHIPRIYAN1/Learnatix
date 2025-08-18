import React from 'react';
import CenterBlur from './_components/CenterBlur';
import Link from 'next/link';
import BubblesBackground from './_components/bubb';

    
export default function NotFound() {
  return (
    <div className=" z-[2] select-none h-[100vh] w-[100vw] bg-[rgb(3,8,22)] flex items-center justify-center">
      <CenterBlur />
      <BubblesBackground />
      <div className=" z-[3]  border-gray-600  text-secondary flex flex-col items-center justify-center text-center">
            <h1 className="text-9xl text-primary font-bold ">404</h1>
            <p className="mt-4 text-7xl ">Where Are We Again?</p>
            <Link href="/" className=" text-blue-500 mt-6 hover:underline">
                Go back to Home
            </Link>
      </div>
    </div>
  );
}
