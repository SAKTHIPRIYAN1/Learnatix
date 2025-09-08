"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import MyEmojiPicker from "./emojiPicker";
import { useParams } from "next/navigation";

import IconSend from "../(Icons)/sendIcon";
import IconSmile from "../(Icons)/smileIcon";
import axios from "axios";
// useSocket!!!
import { useSocket } from "@/lib/socket/socketProvider";

// storee..
import { useAppDispatch,useAppSelector } from "@/store/hook";
import { addChatMessage } from "@/store/slices/classRoomSlice";
import { useUser } from "@clerk/clerk-react";
const API_URL=process.env.NEXT_PUBLIC_BACKEND_URL;

type TyperDivProps = {
  scrollfunc: React.Dispatch<React.SetStateAction<boolean>>;
};

// this is the Type  div for the chat Page!!!!!....
const InpTypeDivChatPage = ({ scrollfunc }: TyperDivProps) => {
      const [message, setMessage] = useState("");
      const [isPickerVisible, setVisible] = useState(false);
      const textareaRef = useRef<HTMLTextAreaElement | null>(null);
      // const FileRef = useRef<HTMLInputElement | null>(null);
      const {user}=useUser();
      
      const dispatch=useAppDispatch();
      const {name} = useAppSelector((store)=>store.user);

      const {socket} = useSocket();

      // for extracting the classRoomId!!!!
      const params = useParams();
      const classRoomId = params.classRoomId as string;

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    //  to set the scroll height for auto scrolling during the message sending!!!!
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      if (textareaRef.current.scrollHeight > 150) {
        textareaRef.current.style.height = "150px";
        textareaRef.current.style.overflowY = "scroll";
      } else {
        textareaRef.current.style.overflowY = "hidden";
      }
    }

  };




  // this is the function to actually send the message!!!
  const handleSend = async() => {
    if (message.trim().length <= 0) {
      return;
    }

    try{
      const res=await axios.post(`${API_URL}/chat/sendMessage`,{
        message,
        senderId:user? user.id :"Myid",
        senderName:name? name :"Unknown",
        classRoomId
      });

      console.log("Result of the sending:",res.data);
    }catch(err){
      console.log(err);
    }
    
    setMessage("");
    scrollfunc((cur) => !cur); // scroll down after sending
  };

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files?.length) return;
  //   console.log("Selected file:", e.target.files[0]);
  // };

  return (
    <div className="flex px-4 m-0  w-full min-h-[50px] bg-slate-900/30 backdrop-blur-lg border-t border-slate-700 items-center">
      {/* File Upload */}
      

      {/* Input Box */}
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleInput}
        placeholder="Enter your message..."
        className="resize-none bg-transparent flex-1 outline-none overflow-hidden    my-auto text-slate-200"
        rows={1}
        style={{ maxHeight: "150px" }}
      />

      {/* Action Icons */}
      <div className="flex items-center gap-4 ml-4">
        <div onClick={() => setVisible((v) => !v)}>
          <IconSmile height={22} width={22} className="fill-yellow-500 hover:opacity-95 cursor-pointer active:scale-90 transition-all " />
        </div>
        {isPickerVisible && <MyEmojiPicker func={setMessage} val={message} />}
        <div onClick={handleSend}>
          <IconSend height={21} width={21} className="fill-blue-500 cursor-pointer active:scale-90 transition-all " />
        </div>
      </div>
    </div>
  );
};

export default InpTypeDivChatPage;