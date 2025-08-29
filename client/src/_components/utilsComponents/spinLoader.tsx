'use client';
import React from "react";
const SpinLoader = () => {
    return (
        <div className="z-normal flex items-center justify-center h-40">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-500 border-t-white" />
          <p className="ml-3 text-gray-300">Loading login...</p>
        </div>
    );
};

export default SpinLoader;
