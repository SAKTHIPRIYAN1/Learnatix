

"use client";

import React, { useState } from "react";


import PeopleIcon from "../(Icons)/peopleIc";
import TrashIcon from "../(Icons)/trashIc";
import ShareIcon from "../(Icons)/shareIc";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

import axios from "axios";

// typess..
import { ClassRoomResponse } from "@/types/classRoom";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;



const ClassRoomCard = (props:ClassRoomResponse) => {
  const {isLoaded ,user}=useUser();

  const [isSharing,setSharing]=useState<boolean>(props.inviteToken.isSharing)
  const handleSharing =async()=>{
    try{
      console.log("clicked Share TOggle!!",isSharing);
      const res=await axios.patch(API_URL+"/class/updateSharing",{
        userId:user?.id,
        roomId:props.roomId,
        token:props.inviteToken.token,
        sharing:!isSharing ? true :false
      });
      console.log(res);
      toast.success("Joining Access Modified");
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
      <h2 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
        {props.name}
      </h2>
      <h3 className="text-sm text-slate-300 mt-1 line-clamp-2">
        {props.teachers[0].user.name}
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
  <div className="flex justify-between h-[20%] gap-2 mt-4 w-full">
    
      {
        // togling the sharing the classsRoom and Not Sharing the ClassRomm...
        !isSharing?
        <div onClick={handleSharing}  className=" relative group p-[6px] w-full rounded-lg bg-green-500/10 border border-green-700/40 
                    flex justify-center cursor-pointer active:scale-95 transition-all 
                    hover:bg-green-500/20 hover:border-green-500/70">
        <ShareIcon className="fill-green-400" height={22} width={22} />
        <span className="absolute bottom-[120%] scale-0 group-hover:scale-100 transition-all bg-slate-500/40  text-gray-50 text-xs rounded-md px-2 py-1 whitespace-nowrap">
                  {"Share Link"}
        </span>
        </div>
        :
        <div onClick={handleSharing}  className=" relative group p-[6px] w-full rounded-lg bg-green-600/10 border border-green-800/40 
                    flex justify-center cursor-not-allowed active:scale-95 transition-all 
                    hover:bg-green-600/20 hover:border-green-600/70">
        <ShareIcon className="fill-green-500" height={22} width={22} />
        <span className="absolute bottom-[120%] scale-0 group-hover:scale-100 transition-all bg-slate-500/40  text-gray-50 text-xs rounded-md px-2 py-1 whitespace-nowrap">
                  {"Stop Sharing"}
        </span>
        </div>
      }
   
    <div className=" relative group p-[6px] w-full rounded-lg bg-blue-500/10 border border-blue-700/40 
                    flex justify-center cursor-pointer active:scale-95 transition-all 
                    hover:bg-blue-500/20 hover:border-blue-500/70">
      <PeopleIcon className="fill-blue-400" height={22} width={22} />
      <span className="absolute bottom-[120%] scale-0 group-hover:scale-100 transition-all bg-slate-500/40  text-gray-50 text-xs rounded-md px-2 py-1 whitespace-nowrap">
                  View Participants
        </span>
    </div>
    <div className=" relative group p-[6px] w-full rounded-lg bg-red-500/10 border border-red-700/40 
                    flex justify-center cursor-pointer active:scale-95 transition-all 
                    hover:bg-red-500/20 hover:border-red-500/70">
      <TrashIcon className="fill-red-400" height={22} width={22} />
      <span className="absolute bottom-[120%] scale-0 group-hover:scale-100 transition-all bg-slate-500/40  text-gray-50 text-xs rounded-md px-2 py-1 whitespace-nowrap">
                  Delete Class
        </span>
    </div>
  </div>
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