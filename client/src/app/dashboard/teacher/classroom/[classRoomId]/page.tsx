"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import ChatPage from "@/_components/(commonComponents)/chatPage";

import { useAppDispatch,useAppSelector } from "@/store/hook";
import { setActiveTab } from "@/store/slices/classRoomSlice";
import { ClassRoomOptions } from "@/types/classRoom";
import { label } from "framer-motion/client";

const IndividualStudentClass = () => {
  const params = useParams();
  const classRoomId = params.classRoomId as string;

  const dispatch=useAppDispatch();
  const {activeTab} =useAppSelector((store)=>store.classroom);
  

  const tabs = [
    { id: "chat", label: "Chat" },
    { id: "people", label: "People" },
    {id:"notes",label:"Notes"},
    { id: "works", label: "Works" },
  ];

  // for direction (left/right slide)
  // for the smooth sliding!!!!!
  const [prevTab, setPrevTab] = useState<ClassRoomOptions>("chat");

  const handleTabChange = (newTab: ClassRoomOptions) => {
    setPrevTab(activeTab);
    dispatch(setActiveTab(newTab));
  };

  // animation variants.....
  // like the trigger point of the animationssss...

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      position: "absolute" as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      position: "absolute" as const,
    }),
  };

  // determine direction (1 = forward, -1 = backward)
  // for to fins it is forwaard or backward!!!!

  const getDirection = (from: string, to: string) => {
    const order = ["chat", "people", "works"];
    return order.indexOf(to) - order.indexOf(from);
  };

  return (
    <div className="flex items-start justify-center w-full  pb-2  pr-5 h-full">
       <div className=" h-[600px] overflow-y-auto pb-3 w-full px-4 bg-slate-950/20 flex flex-col border-[1px] rounded-2xl border-slate-600/30">
          {/* Header Tabs */}
          <div className="flex gap-5 border-b border-slate-700/40 z-[10] bg-slate-950/20 backdrop-blur-md">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as "chat" | "people" | "works")}
                className={`cursor-pointer relative py-3 text-center font-semibold transition-colors
                  ${activeTab === tab.id 
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600" 
                    : "text-slate-400 hover:text-slate-200"}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="h-[600px]  overflow-y-scroll overflow-x-hidden relative">
            <AnimatePresence mode="wait" custom={getDirection(prevTab, activeTab)}>
              <motion.div
                key={activeTab}
                custom={getDirection(prevTab, activeTab)}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full h-auto"
              >
                {activeTab === "chat" && <ChatPage />}
                {activeTab === "people" && <ParticipantsPage />}
                {activeTab === "works" && <WorksPage />}
                {activeTab === "notes" && <NotesPage />}
              </motion.div>
            </AnimatePresence>
          </div>
      </div>
    </div>
  );
};




const ParticipantsPage = () => (
  <div className="p-4 text-slate-300">Participants list goes here...</div>
);

const NotesPage = () => (
  <div className="p-4 text-slate-300">Participants list goes here...</div>
);

const WorksPage = () => (
  <div className="p-4 text-slate-300">works works go here...</div>
);

export default IndividualStudentClass;
