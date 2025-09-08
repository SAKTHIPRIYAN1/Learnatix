"use client";
import React,{useEffect, useState} from "react";
import { useAppSelector,useAppDispatch } from "@/store/hook";
import { setClassChats } from "@/store/slices/classRoomSlice";
import MessageContainer from "../utilsComponents/chatContianer";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "next/navigation";
import { ChatMessage } from "@/types/classRoom";
import { useUser } from "@clerk/clerk-react";

const API_URL=process.env.NEXT_PUBLIC_BACKEND_URL;
const ClassRoomChatPageComp=({ reff }: { reff: React.RefObject<HTMLDivElement | null> })=>{
    // for extracting the classRoomId!!!!
          const params = useParams();
          const classRoomId = params.classRoomId as string;
          const dispatch=useAppDispatch();

          const {user}=useUser();
        const [loading,setLoading] =useState<boolean>(false);

    useEffect(()=>{
        async function getAllChats(){
            try{
                if(!user)
                    return;
                
                setLoading(true);
                const res=await axios.post(API_URL+'/chat/',{
                    classId:classRoomId,
                    userId:user.id
                });
                
                console.log("chat Reterived");
                const data= res.data as {msg:string,chats:ChatMessage[]};
                console.log(data.chats);
                dispatch(setClassChats(data.chats));
            }catch(err){
                toast.error("Error in reteriving Messages");
                console.log(err);
            }finally{
                setLoading(false);
            }
        };
        getAllChats();
    },[user]);

    const {chatMessages,} =useAppSelector((store)=>store.classroom);


    if(loading){
            return(
            <ChatSkeleton />
        )
    }


    return (
        <div
            ref={reff}
            className="flex-1 overflow-y-auto  p-4 text-slate-300"
        >
                {
                    chatMessages.map((el,idx)=>{
                        return(
                            <MessageContainer sender={el.sender} classRoomId={el.classRoomId}  previousSender={idx > 0 ? chatMessages[idx - 1].senderId : undefined} message={el.message} senderId={el.senderId} senderName={el.senderName} key={idx} />
                        )
                    })
                }
    </div>
    )
}

const ChatSkeleton = () => {
  return (
    <div className="flex flex-col h-full p-4 space-y-4 animate-pulse">

      <div className="flex-1 overflow-y-auto space-y-4 py-2">
        {/* Incoming msg */}
        <div className="flex gap-3 items-start">
          <div className="space-y-2">
            <div className="h-5 w-50 bg-slate-700/40 rounded" />
            <div className="h-5 w-48 bg-slate-700/30 rounded" />
          </div>
        </div>

        {/* Outgoing msg */}
        <div className="flex justify-end">
          <div className="space-y-2">
            <div className="h-5 w-56 bg-slate-700/40 rounded" />
            <div className="h-5 w-40 bg-slate-700/30 rounded ml-auto" />
          </div>
        </div>

        {/* Another incoming */}
        <div className="flex gap-3 items-start">
          <div className="space-y-2">
            <div className="h-5 w-58 bg-slate-700/40 rounded" />
            <div className="h-5 w-42 bg-slate-700/30 rounded" />
          </div>
        </div>

        {/* Outgoing msg */}
        <div className="flex justify-end">
          <div className="space-y-2">
            <div className="h-5 w-56 bg-slate-700/40 rounded" />
            <div className="h-5 w-40 bg-slate-700/30 rounded ml-auto" />
          </div>
        </div><div className="flex gap-3 items-start">
          <div className="space-y-2">
            <div className="h-5 w-58 bg-slate-700/40 rounded" />
            <div className="h-5 w-42 bg-slate-700/30 rounded" />
          </div>
        </div>

        {/* Outgoing msg */}
        <div className="flex justify-end">
          <div className="space-y-2">
            <div className="h-5 w-56 bg-slate-700/40 rounded" />
            <div className="h-5 w-40 bg-slate-700/30 rounded ml-auto" />
          </div>
        </div>
     

    </div>
    </div>
  );
};


export default ClassRoomChatPageComp;