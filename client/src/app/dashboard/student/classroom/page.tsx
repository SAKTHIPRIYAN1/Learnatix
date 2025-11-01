"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";
import Loader from "../loading";
import axios from "axios";
import toast from "react-hot-toast";


import ClassRoomCard from "@/_components/(commonComponents)/ClassRoomCard";
import { ClassRoomResponse } from "@/types/classRoom";
import { useAppDispatch,useAppSelector } from "@/store/hook";
import { CardLoading } from "@/_components/(commonComponents)/ClassRoomCard";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// for socket connections!!!
import { useSocket } from "@/lib/socket/socketProvider";

// store actions
import { setClassRooms,delClassRoom,addClassRoom } from "@/store/slices/usesrSlice";

export default function DashboardClient() {
  const { user, isLoaded } = useUser();
    const router = useRouter();
    const dispatch=useAppDispatch();
    


    const enrolledClasses = useAppSelector((state) => state.user.classRooms);
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
    
  useEffect(() => {

    
  getAllClass();

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
  }, [isLoaded, user, router]);

  // for real time classRoom updates
  const {socket} = useSocket();

  useEffect(()=>{
    if (!socket || !user || !isLoaded) return;

    // for adding the new ClassRoom in realtime
        socket.on("newClass", (classRoom) => {
          dispatch(addClassRoom(classRoom));
        });

    // for deleting the class in realtime
        socket.on("delClass", (classRoomId) => {
          dispatch(delClassRoom(classRoomId));
        });

    // clean up function
    return () => {
      socket.off("newClass");
      socket.off("delClass");
    };
  }, [socket, user, isLoaded]);


  if (!isLoaded) {
    return( <>
        <CardLoading />
      </>);
  }

   return (
    <div className="overflow-y-auto grid grid-cols-[repeat(auto-fit,minmax(300px,360px))] gap-y-6 gap-x-10  justify-start max-w-[1200px] mx-6">

     {enrolledClasses.length > 0 ?
        enrolledClasses.map((c,idx)=>{
          return(
            <ClassRoomCard basePath="/dashboard/student/classroom" name={c.name} teachers={c.teachers} description={c.description} pic={c.pic} roomId={c.roomId}  inviteToken={c.inviteToken} key={idx} />
          )
        }):
        <p>
          No Classes Found!!
        </p>
      }
    </div>
  );
}
