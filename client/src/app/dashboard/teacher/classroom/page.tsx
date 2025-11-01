"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Loader from "../loading";
import { use, useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import ClassRoomCard from "@/_components/(commonComponents)/ClassRoomCard";
import { ClassRoomResponse } from "@/types/classRoom";

import { useSocket } from "@/lib/socket/socketProvider";
import { useAppDispatch,useAppSelector } from "@/store/hook";
import { delClassRoom, addClassRoom,setClassRooms } from "@/store/slices/usesrSlice";
import { CardLoading } from "@/_components/(commonComponents)/ClassRoomCard";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function DashboardClient() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const enrolledClasses = useAppSelector((state) => state.user.classRooms);

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
          dispatch(setClassRooms(data.classes));
        }catch(err){
          console.log(err);
          toast.error("Error in reterival of class");
        }

      };

      if (isLoaded && !user) {
        router.push("/");
      }
  
      if(isLoaded && user?.unsafeMetadata?.role === "STUDENT") {
        router.push("/dashboard/student/classroom"); 
      }else if(isLoaded && user?.unsafeMetadata?.role !== "TEACHER") {
        router.push("/");
      }
      
      getAllClass();

    }, [isLoaded, user, router]);

    const {socket}=useSocket();
    const dispatch=useAppDispatch();

  useEffect(()=>{
    if (!socket || !user || !isLoaded) return;

    // for adding the new ClassRoom in realtime
        socket.on("newClass", (classRoom) => {
          dispatch(addClassRoom(classRoom));
        });

    // for deleting the class in realtime
        socket.on("delClass", (classRoomId) => {
          console.log(classRoomId);
          dispatch(delClassRoom(classRoomId));
        });

    // clean up function
    return () => {
      socket.off("newClass");
      // socket.off("delClass");
    };
  }, [socket, user, isLoaded]);


  if (!isLoaded) {
    return( <>
        <CardLoading />
      </>);
  }

  return (
   <div className="overflow-y-auto grid grid-cols-[repeat(auto-fit,minmax(300px,360px))] gap-y-6 gap-x-10  justify-start max-w-[1200px] mx-6">

     {enrolledClasses.length > 0?
        enrolledClasses.map((c,idx)=>{
          return(
            <ClassRoomCard basePath="/dashboard/teacher/classroom" name={c.name} teachers={c.teachers} description={c.description} pic={c.pic} roomId={c.roomId}  inviteToken={c.inviteToken} key={idx} />
          )
        }):
        <p>
          No Classes Found!!
        </p>
      }
</div>

  );
}
