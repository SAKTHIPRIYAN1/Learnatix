

"use client";

import React, { useState } from "react";


import PeopleIcon from "../(Icons)/peopleIc";
import TrashIcon from "../(Icons)/trashIc";
import ShareIcon from "../(Icons)/shareIc";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import ChatIcon from "../(Icons)/chatIc";

import axios from "axios";
import copyTextToClipboard from '@/utilFunctions/copyToClip';
import { ClassRoomCardIconDiv } from "./classRoomCardIconDiv";
import { useRouter} from "next/navigation";
import Link from "next/link";

// typess..
import { ClassRoomResponse } from "@/types/classRoom";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ClassRoomCard = (props:ClassRoomResponse) => {
  const {isLoaded ,user}=useUser();
  const router=useRouter();

  const [isSharing,setSharing]=useState<boolean>(props.inviteToken.isSharing);

//  for altering the Sharing Link Acess!!!
  const handleSharing =async()=>{
    // if sharing is enabled now only make the magic code copied to the clip board!!!
    // sending the alteration to the backend!!!
    try{
      console.log("clicked Share TOggle!!",isSharing);
      const res=await axios.patch(API_URL+"/class/updateSharing",{
        userId:user?.id,
        roomId:props.roomId,
        token:props.inviteToken.token,
        sharing:!isSharing ? true :false
      });
      console.log(res);
      if(!isSharing){
        copyTextToClipboard(props.inviteToken.token);
        toast.success("Magic Spell copied !");
     }
     else{
      toast.success("Magic spell is hidden to the Muggles!!!");
     }
      setSharing(!isSharing);
    }
    catch(err){
      console.log(err);
      toast.error("Error in Operation");
    }
  }

  if(!isLoaded){
    return(
      <CardLoading />
    )
  }

return (
  <div className=" select-none h-50 w-88 p-4 rounded-2xl border border-slate-600/40 shadow-md 
                hover:shadow-lg transition-all bg-slate-400/5 backdrop-blur-sm 
                flex flex-col justify-between">
  {/* Top Section */}
  <div className="flex overflow-ellipsis w-full gap-3 h-[80%]  justify-between items-center">
    {/* Description */}
    <div className="flex-1 min-w-0">
      <Link 
      href={`${props.basePath}/${props.roomId}`}
      
      className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent
                hover:underline hover:decoration-blue-500 hover:underline-offset-4 cursor-pointer transition-all"
    >
      {props.name}
    </Link>

      <h3 className="text-sm text-slate-300 mt-1 line-clamp-2">
        {props.teachers[0].user?.name  }
      </h3>
      <h4 className="text-sm text-slate-400 mt-2 line-clamp-2 ">
        {props.description}
      </h4>
      
    </div>

    {/* Image */}
    <div className=" flex-shrink-0 select-none flex justify-center ml-3">
      <img
        src={`${API_URL}/uploads/${props.pic}`}
        alt="Class"
        className="h-20 w-20 object-cover rounded-lg border border-slate-600/40 shadow-sm"
      />
    </div>
  </div>

  {/* Icons Section */}
  <ClassRoomCardIconDiv classId={props.roomId} baseUrl={props.basePath+'/'+props.roomId } isSharing={isSharing} user={user} handleSharing={handleSharing}  />
</div>

  );
};

export const CardLoading=()=>{
  return (
    <div className="h-46 w-88 p-4 rounded-xl border border-slate-700 shadow-md animate-pulse flex flex-col justify-between">
  {/* Top Section */}
  <div className="flex w-full gap-1 justify-between items-center">
    {/* Text placeholders */}
    <div className="flex-1 min-w-0 space-y-2">
      <div className="h-5 w-28 bg-slate-700 rounded"></div>
      <div className="h-4 w-full bg-slate-700 rounded"></div>
      <div className="h-4 w-3/4 bg-slate-700 rounded"></div>
    </div>

    {/* Image placeholder */}
    <div className="flex-shrink-0 flex justify-center ml-3">
      <div className="h-20 w-20 bg-slate-700 rounded-md"></div>
    </div>
  </div>

  {/* Icons Section */}
  <div className="flex justify-between gap-0.5 mt-4 w-full">
    <div className="h-8 w-full bg-slate-700 rounded-md"></div>
    <div className="h-8 w-full bg-slate-700 rounded-md"></div>
    <div className="h-8 w-full bg-slate-700 rounded-md"></div>
  </div>
</div>
  )
}



export default ClassRoomCard;