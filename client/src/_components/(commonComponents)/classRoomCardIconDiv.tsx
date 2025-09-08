"use client";

import PeopleIcon from "../(Icons)/peopleIc";
import TrashIcon from "../(Icons)/trashIc";
import ShareIcon from "../(Icons)/shareIc";
import ChatIcon from "../(Icons)/chatIc";

import { useAppDispatch } from "@/store/hook";
import { setActiveTab } from "@/store/slices/classRoomSlice";
import { useRouter } from "next/navigation";
import { Participant } from "@/types/classRoom";

export const ClassRoomCardIconDiv=({handleSharing,isSharing,user,baseUrl}:{handleSharing:VoidFunction,isSharing:boolean,user:any,baseUrl:string})=>{
  const dispatch=useAppDispatch();
  const router=useRouter();
  return(
    <div className="flex justify-between h-[20%] gap-2 mt-4 w-full">
    
      {
        user?.unsafeMetadata.role =="TEACHER" ?
              // togling the sharing the classsRoom and Not Sharing the ClassRomm...
              //  for teacher!!!!
              (!isSharing?
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
              </div>)
            :
            // for student....
            <div onClick={()=>{
              dispatch(setActiveTab("chat"));
              router.push(baseUrl);
            }} className=" relative group p-[6px] w-full rounded-lg bg-green-500/10 border border-green-700/40 
                    flex justify-center cursor-pointer active:scale-95 transition-all 
                    hover:bg-green-500/20 hover:border-green-500/70">
              <ChatIcon className="fill-green-400" height={22} width={22} />
              <span className="absolute bottom-[120%] scale-0 group-hover:scale-100 transition-all bg-slate-500/40  text-gray-50 text-xs rounded-md px-2 py-1 whitespace-nowrap">
                          Chat 
                </span>
            </div>
      }

    <div onClick={()=>{dispatch(setActiveTab("people")); router.push(baseUrl)}} className=" relative group p-[6px] w-full rounded-lg bg-blue-500/10 border border-blue-700/40 
                    flex justify-center cursor-pointer active:scale-95 transition-all 
                    hover:bg-blue-500/20 hover:border-blue-500/70">
      <PeopleIcon className="fill-blue-400" height={22} width={22} />
      <span className="absolute bottom-[120%] scale-0 group-hover:scale-100 transition-all bg-slate-500/40  text-gray-50 text-xs rounded-md px-2 py-1 whitespace-nowrap">
                  View Participants
        </span>
    </div>
    <div  className=" relative group p-[6px] w-full rounded-lg bg-red-500/10 border border-red-700/40 
                    flex justify-center cursor-pointer active:scale-95 transition-all 
                    hover:bg-red-500/20 hover:border-red-500/70">
      <TrashIcon className="fill-red-400" height={22} width={22} />
      <span className="absolute bottom-[120%] scale-0 group-hover:scale-100 transition-all bg-slate-500/40  text-gray-50 text-xs rounded-md px-2 py-1 whitespace-nowrap">
                  Delete Class
        </span>
    </div>
  </div>
  );
}