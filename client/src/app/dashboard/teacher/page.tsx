"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Loader from "./loading";
import { useEffect } from "react";

export default function DashboardClient() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
      if (isLoaded && !user) {
        router.push("/");
      }
  
      
      if(isLoaded && user?.unsafeMetadata?.role === "STUDENT") {
        router.push("/dashboard/student"); 
      }else if(isLoaded && user?.unsafeMetadata?.role !== "TEACHER") {
        router.push("/");
      }
  
    }, [isLoaded, user, router]);

  if (!isLoaded) {
    return <Loader />;
  }

  return <p className="z-normal text-white">Hello Teacher, {user?.id}</p>;
}
