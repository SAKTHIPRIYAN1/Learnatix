"use client";
import React from "react";
import { useAppSelector } from "@/store/hook";
import MessageContainer from "../utilsComponents/chatContianer";

const ClassRoomChatPageComp=({ reff }: { reff: React.RefObject<HTMLDivElement | null> })=>{
    const {chatMessages} =useAppSelector((store)=>store.classroom);
    return (
        <div
            ref={reff}
            className="flex-1 overflow-y-auto  p-4 text-slate-300"
        >
                {
                    chatMessages.map((el,idx)=>{
                        return(
                            <MessageContainer  previousSender={idx > 0 ? chatMessages[idx - 1].senderId : undefined} message={el.message} senderId={el.senderId} senderName={el.senderName} key={idx} />
                        )
                    })
                }
    </div>
    )
}

export default ClassRoomChatPageComp;