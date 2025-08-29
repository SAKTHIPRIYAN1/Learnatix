"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "./loading";

export default function DashboardClient() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }

    if(isLoaded && user?.unsafeMetadata?.role === "TEACHER") {
      router.push("/dashboard/teacher");
    }
    else if(isLoaded && user?.unsafeMetadata?.role !== "STUDENT") {
      router.push("/"); 
    }

  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return <Loader />;
  }

  return <p className="z-normal h-screen text-white">Hello Student, {user?.id}</p>;
}
