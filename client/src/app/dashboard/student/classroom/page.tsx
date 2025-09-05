"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";
import Loader from "../loading";
import axios from "axios";
import toast from "react-hot-toast";


import ClassRoomCard from "@/_components/(commonComponents)/ClassRoomCard";
import { ClassRoomResponse } from "@/types/classRoom";
import { useAppDispatch } from "@/store/hook";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function DashboardClient() {
  const { user, isLoaded } = useUser();
    const router = useRouter();
    const dispatch=useAppDispatch();
    
  const [enrolledClass,setEnrolledClass]=useState<ClassRoomResponse[]>([]);
  
  useEffect(() => {

    async function getAllClass(){
        if(!user || !isLoaded)
            return;
        
        try{
          const res=await axios.post(API_URL+"/class/getAllClass",{
            id:user.id,
            role:(user.unsafeMetadata.role as string) || "TEACHER"
          });

          console.log(res.data);
          const data= res.data as {msg:string,classes:ClassRoomResponse[]};
          console.log(data.classes);
          setEnrolledClass(data.classes);
        }catch(err){
          console.log(err);
          toast.error("Error in reterival of class");
        }

      };


    if (isLoaded && !user) {
      router.push("/");
    }

    if(isLoaded && user?.unsafeMetadata?.role === "TEACHER") {
      router.push("/dashboard/teacher/classroom");
    }
    else if(isLoaded && user?.unsafeMetadata?.role !== "STUDENT") {
      router.push("/"); 
    }else{
      router.push("/dashboard/student/classroom");
    }

    getAllClass();

  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return <Loader />;
  }

   return (
    <div className="overflow-y-auto h-full flex gap-12">

     {enrolledClass?
        enrolledClass.map((c,idx)=>{
          return(
            <ClassRoomCard basePath="/dashboard/student/classroom" name={c.name} teachers={c.teachers} description={c.description} pic={c.pic} roomId={c.roomId} students={c.students} inviteToken={c.inviteToken} key={idx} />
          )
        }):
        <p>
          No Classes Found!!
        </p>
      }
    </div>
  );
}
