"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { IconBell } from "../(Icons)/Icons";

import { ChatMessage } from "@/types/classRoom";

const MessageContainer = ({ sender, message, senderId, senderName,previousSender }: ChatMessage & { senderName?: string }) => {
  const { user } = useUser();
 if (!user) return null;

  const showName = senderId !== previousSender; // for groping the same sender messagee!!!
  return (
    <div className="relative">
      {user.id === senderId ? (
        <YourMessContainer Mess={message} Name={"You"} showName={showName} />
      ) : (
        <TheirMessContainer Mess={message} Name={sender?.name ?? "Unknown"} showName={showName} isTeacher={sender?.role ==="TEACHER"} />
      )}
    </div>
  );
};

// ---------------- Your Messages ----------------
const YourMessContainer: React.FC<{ Mess: string; Name: string; showName: boolean }> = ({ Mess, Name, showName }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const messageRef = useRef<HTMLDivElement | null>(null);

  const charLimit = 100;

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isExpanded, Mess]);

  return (
    <div ref={messageRef} className="flex mb-[1px] items-end justify-end p-[3px] group relative w-full h-auto">
      <div className="flex flex-col items-end max-w-[55%]">
        {showName && <span className="text-xs text-slate-400 mb-1">{Name}</span>}
        
        <div className="leading-relaxed text-[15px] relative bg-gradient-to-r from-sky-700/70 to-indigo-800/60 backdrop-blur-lg border border-blue-500/20  px-3 py-2 rounded-md flex flex-col justify-center   shadow-lg">
          <p className={`text-slate-100 whitespace-pre-wrap ${!isExpanded ? "max-h-[5em] overflow-hidden " : ""}`}>
            {isExpanded ? Mess : `${Mess.substring(0, charLimit)}${Mess.length > charLimit ? "..." : ""}`}
          </p>
          {Mess.length > charLimit && (
            <span className="text-cyan-400 cursor-pointer ml-2" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Read less" : "Read more"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------- Their Messages ----------------
const TheirMessContainer: React.FC<{ Mess: string; Name: string; showName: boolean,isTeacher:boolean }> = ({ Mess, Name, showName,isTeacher }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const messageRef = useRef<HTMLDivElement | null>(null);

  const charLimit = 100;

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isExpanded, Mess]);

  return (
    <div ref={messageRef} className="flex mb-[1px] items-start justify-start p-[3px] group w-full h-auto">
      <div className="flex flex-col items-start max-w-[55%]">
        {showName && <span className={isTeacher?"text-xs text-cyan-500 mb-1" : "text-xs text-slate-400 mb-1"}>{Name}</span>}
        
        <div className="leading-relaxed text-[15px] relative bg-gradient-to-r from-violet-700/60 to-fuchsia-800/60 backdrop-blur-md border border-fuchsia-600/10 p-2 px-3 rounded-md flex flex-col shadow-lg">
          <p className={`text-slate-100 whitespace-pre-wrap ${!isExpanded ? "max-h-[5em] overflow-hidden" : ""}`}>
            {isExpanded ? Mess : `${Mess.substring(0, charLimit)}${Mess.length > charLimit ? "..." : ""}`}
          </p>
          {Mess.length > charLimit && (
            <span className="text-cyan-400 cursor-pointer ml-2" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Read less" : "Read more"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;
