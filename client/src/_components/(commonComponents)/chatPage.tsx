"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import MyEmojiPicker from "../utilsComponents/emojiPicker";
import InpTypeDivChatPage from "../utilsComponents/InpTypeDivChatPage";
import ClassRoomChatPageComp from "./classRoomChatPageComp";
import { useSocket } from "@/lib/socket/socketProvider";
import { useAppDispatch } from "@/store/hook";
import { addChatMessage } from "@/store/slices/classRoomSlice";
import { useUser } from "@clerk/clerk-react";

const ChatPage = ({classRoomId}:{classRoomId:string}) => {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  
  const {socket} =useSocket();
  const dispatch=useAppDispatch();
  const {user} =useUser();

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: mainRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [scrollToBottom]);

  // socket Function for the classRoom function and operations!!!!
  useEffect(() => {
    if (!socket || !classRoomId || !user) return;
    console.log("from ChatPage:",classRoomId);

    // for fetching new Messages!!!
    const handleNewMessage = (data: any) => {
      console.log("New message:", data);
      console.log(user?.id , data.senderId,user?.id==data.senderId);
      if(classRoomId!=data.classRoomId || user?.id==data.senderId){
        return ;
      }

      console.log("adding New MEssages");
      dispatch(addChatMessage(data))
    };

    // for handling new Messages in the Group
    socket.on("newMessage", handleNewMessage);

    // cleanup function
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
    
  }, [socket, classRoomId,user]);



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
    <div className="flex   w-full  relative z-10 h-[540px]">
      <div className="flex m-0 p-0 flex-col w-full h-full">

        {/* Actual Message contnet*/}
        <ClassRoomChatPageComp reff={mainRef} />

        {/* typer Bar */}
        <InpTypeDivChatPage scrollfunc={setScrollToBottom} />
      </div>
    </div>
  );
};



export default ChatPage;
