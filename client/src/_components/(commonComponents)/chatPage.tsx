"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import MyEmojiPicker from "../utilsComponents/emojiPicker";
import InpTypeDivChatPage from "../utilsComponents/InpTypeDivChatPage";
import ClassRoomChatPageComp from "./classRoomChatPageComp";



const ChatPage = () => {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [scrollToBottom, setScrollToBottom] = useState(false);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: mainRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [scrollToBottom]);

  const Auth = true;
  const isEmpty = false;
  const name = "John Doe";

  if (!Auth || isEmpty) {
    return (
      <div className="h-full flex justify-center w-[65%] items-center">
        <div className="bg-slate-800/80 p-1 px-3 rounded-xl">
          <h1>Select the Contact to start Messaging</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex  right-0 w-full  relative z-10 h-[532px]">
      <div className="flex flex-col w-full h-full">

        {/* Actual Message contnet*/}
        <ClassRoomChatPageComp reff={mainRef} />

        {/* typer Bar */}
        <InpTypeDivChatPage scrollfunc={setScrollToBottom} />
      </div>
    </div>
  );
};



export default ChatPage;
