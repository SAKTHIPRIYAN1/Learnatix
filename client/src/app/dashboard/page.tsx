"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardClient() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/"); // redirect if not logged in
    }

    console.log("User role:", user?.unsafeMetadata.role); // Debug log

    if(user?.unsafeMetadata.role === "TEACHER"){
      router.push("/dashboard/teacher/classroom");
    }
    else if(user?.unsafeMetadata.role === "STUDENT"){
      router.push("/dashboard/student/classroom");
    }
    else{
      router.push("/");
     } // redirect if role is undefined or unrecognized  
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return <p>Loading...</p>; // prevent flicker
  }

  return null;
}
