"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import MyEmojiPicker from "./emojiPicker";




const ClipIc = () => <span className="text-slate-400">📎</span>;
const Similey = () => <span className="text-yellow-400">😊</span>;
const SendIc = () => <span className="text-blue-400">➡️</span>;




type TyperDivProps = {
  scrollfunc: React.Dispatch<React.SetStateAction<boolean>>;
};

// this is the Type  div for the chat Page!!!!!....
const InpTypeDivChatPage = ({ scrollfunc }: TyperDivProps) => {
  const [message, setMessage] = useState("");
  const [isPickerVisible, setVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  // const FileRef = useRef<HTMLInputElement | null>(null);

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
  const handleSend = () => {
    if (message.trim().length <= 0) return;
    console.log("Sending:", message);
    setMessage("");
    scrollfunc((cur) => !cur); // scroll down after sending
  };

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files?.length) return;
  //   console.log("Selected file:", e.target.files[0]);
  // };

  return (
    <div className="flex px-4 w-full min-h-[50px] bg-slate-900/30 backdrop-blur-lg border-t border-slate-700 items-center">
      {/* File Upload */}
      

      {/* Input Box */}
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleInput}
        placeholder="Enter your message..."
        className="resize-none bg-transparent flex-1 outline-none overflow-hidden my-auto text-slate-200"
        rows={1}
        style={{ maxHeight: "150px" }}
      />

      {/* Action Icons */}
      <div className="flex items-center gap-4 ml-4">
        <div onClick={() => setVisible((v) => !v)}>
          <Similey />
        </div>
        {isPickerVisible && <MyEmojiPicker func={setMessage} val={message} />}
        <div onClick={handleSend}>
          <SendIc />
        </div>
      </div>
    </div>
  );
};

export default InpTypeDivChatPage;