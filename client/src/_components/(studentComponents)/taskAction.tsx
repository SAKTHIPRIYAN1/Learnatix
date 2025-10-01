"use client";


import {Submission } from "@/types/taskRelatedTypes";

import React, {useState,useEffect } from "react";
import {Download } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSocket } from "@/lib/socket/socketProvider";
import { useAppDispatch } from "@/store/hook";

import { setReviewSubmission } from "@/store/slices/classRoomSlice";

const API_UPL=process.env.NEXT_PUBLIC_BACKEND_URL;
const isPastDue = (due?: string | null) => {
  if (!due) return false;
  return new Date(due).getTime() < new Date().getTime();
};

const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString();
};

/* ----------------- Student Subcomponent ---------------- */
const StudentTaskActions = ({
  taskId,
  currentUserId,
}: {
  taskId: string;
  currentUserId: string;
}) => {

   const task = useSelector((state: RootState) =>
    state.classroom.tasks.find((t) => t.taskId === taskId)
  );



  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [mySubmission, setMySubmission] = useState<Submission | null>(
    task?.submission?.find((s) => s.studentId === currentUserId) ?? null
  );

 
  const duePassed = isPastDue(task?.dueDate);


  const dispatch=useAppDispatch();
  
    const {socket}=useSocket();


      useEffect(()=>{

        if(!socket || !task)
          return;
        
        const handleReviewSubmission=(data:{taskId:string,submission:Submission,userId:string})=>{
          console.log("Reviewed Submission Received via socket:",data);
          if(data.taskId===task.taskId){
            console.log("Dispatching to store");  
            dispatch(setReviewSubmission({taskId:data.taskId,submission:data.submission}));

            if(data.submission.studentId===currentUserId){
              setMySubmission(data.submission);
            }
          }

        }
        
          socket.on("newReview",handleReviewSubmission);

          return()=>{
            socket.off("newReview",handleReviewSubmission);
  
          }
        
    },[socket,task]);




  const handleSubmit = async (e: React.FormEvent,taskId:string) => {
    e.preventDefault();

    if(!taskId)
        return;

    if(!file){
        toast.error("Submit The File as Answer!");
        return;
    }

   


    if (duePassed) {
      toast.error("Due date passed — submission closed.");
      return;
    }

    try{
      const submissionData=new FormData();
      submissionData.append("taskId",taskId);
      submissionData.append("studentId",currentUserId);
      submissionData.append("remark",text);
      if(file)
        submissionData.append("file",file);
      const res =await axios.post(`${API_UPL}/task/submit`,submissionData);
      console.log("Submission response:", res.data);
      
      toast.success("Task Submitted Successfully!");
      setSubmitting(false);
      // Update mySubmission state to reflect the new submission
      const data = res.data as {msg:string,submission:Submission};
      setMySubmission(data.submission);

      // Clear form
      setText("");
      setFile(null);
      return;
    }catch(err){
      console.error("Error submitting task:", err);
      toast.error("Error submitting task");
      return;
    }

  };

  return (
    <div className="mt-3 flex flex-col gap-2">
      {mySubmission ? (
        <div className="bg-slate-800/30 border border-slate-700/30 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-slate-300 font-medium">
                Your submission
              </div>
              
              {mySubmission.filePath && (
                <a
                  href={mySubmission.filePath}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mt-1"
                >
                  <Download className="w-4 h-4" /> Download file
                </a>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">
                {formatDate(mySubmission.createdAt)}
              </div>
              {mySubmission.review &&
                <div className="text-xs text-emerald-400 mt-1">
                Review: {mySubmission.review }
              </div>
              }
              
              {mySubmission.score != null && (
                <div className="mt-1 text-xs text-emerald-400">
                  Score: {mySubmission.score}
                </div>
              )}
              
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={
          (e)=>{
            handleSubmit(e,task?.taskId || "");
          }
          } className="flex flex-col gap-2">
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              duePassed ? "Submission closed (past due)" : "Write your Comments..."
            }
            className="resize-none bg-slate-900/30 border border-slate-700/30 rounded p-2 text-slate-200 outline-none"
          />
          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 px-3 py-1 rounded text-white text-sm">
              Browse
              <input
                type="file"
                className="hidden"
                
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <div className="text-sm text-slate-300 truncate max-w-[260px]">
              {file ? file.name : "No file"}
            </div>
            <button
              type="submit"
              disabled={submitting || duePassed}
              className="ml-auto px-4 py-1 rounded bg-gradient-to-r cursor-pointer from-sky-600 to-blue-600 text-white disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StudentTaskActions;