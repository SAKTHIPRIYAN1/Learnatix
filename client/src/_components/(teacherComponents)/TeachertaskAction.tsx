"use client";

import React, {  useEffect, useState } from "react";
import {  Download } from "lucide-react";
import toast from "react-hot-toast";
import {Submission, Task } from "@/types/taskRelatedTypes";
import axios from "axios";

import { useSocket } from "@/lib/socket/socketProvider";
import { useAppDispatch } from "@/store/hook";

import { RootState } from "@/store/store";

import { setTaskSubmission } from "@/store/slices/classRoomSlice";
import { useSelector } from "react-redux";

const API_URL=process.env.NEXT_PUBLIC_BACKEND_URL;
/* ---------------------- Helpers ------------------------ */
const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString();
};


/* ---------------- Teacher Review Subcomponent ---------------- */
const TeacherReviewSection = ({ taskId,userId }: { taskId: string,userId:string }) => {
  const [expanded, setExpanded] = useState(false);
  const [score,setScore]=useState<number>(0);
  const [review,setReview]=useState<string>("");
  const [isReviwed,setIsReviwed]=useState<boolean>(false);

  const task = useSelector((state: RootState) =>
    state.classroom.tasks.find((t) => t.taskId === taskId)
  );

  console.log(task);
  const dispatch=useAppDispatch();

  const {socket}=useSocket();
    
    useEffect(()=>{
      if(!socket || !task)
        return;
      
      const handleNewSubmission=(data:{taskId:string,submission:Submission})=>{
        console.log("New Submission Received via socket:",data);
        if(data.taskId===task.taskId){
          console.log("Dispatching to store");  
          dispatch(setTaskSubmission(data));
        }
      }

     socket.on("newSubmission",handleNewSubmission);

     return()=>{
      socket.off("newSubmission",handleNewSubmission);
     }
    

    },[socket,task]);

  const handleReviewSubmit = async (submissionId:string) => {
    console.log("Teacher Reviewed!!!");

    if (!task || !score || !review || !userId) {
      toast.error("Fill all the fields!");
      return;
    }

    if(score<0 || score>100){
      toast.error("Enter Valid Score");
      return;
    }

    try{
      const formData= new FormData();
      formData.append("submissionId",submissionId);
      formData.append("score",score.toString());
      formData.append("review",review);
      formData.append("userId",userId);
      const res = await axios.post(`${API_URL}/task/submission/review`, {
            submissionId,
            score,
            review,
            userId
          });

      console.log("Review Response:",res.data);
      toast.success("Review submitted successfully");
      setIsReviwed(true);

      
      // Optionally, you can clear the form or give feedback to the teacher
      // Clear form and close the review section
      // make the form Disappear and show the updated review
      setScore(score);
      setReview(review);
      setExpanded(false);

      // Make the socket Connection and update Value here ...

      // Optionally, you can also refresh the submissions list here to show the updated review
      setExpanded(true);

      
    }catch(err){
      console.log(err);
      toast.error("Error in Reviewing Submission");
    }

  };

  // for socket real time updating the Review and Submission Section!!!
  


  return (
    <div className="mt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm bg-gradient-to-r from-cyan-500 to-blue-500 
                                    bg-clip-text text-transparent hover:underline cursor-pointer"
      >
        {expanded ? "Hide submissions" : "View submissions"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          { task && task.submission && task.submission.length > 0 ? (
            task.submission.map((s,idx) => (
              // actual task of the sudent!!!
              <div
                key={idx}
                className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30"
              >
                {/* the students task and content */}
                <div className="flex justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium text-slate-300">
                      {s.student?.name ||   s.studentId}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{s.remark}</div>
                    {s.filePath && (
                      <a
                        href={s.filePath}
                        className="text-xs text-cyan-400 flex gap-1 items-center hover:underline mt-1"
                      >
                        <Download className="w-4 h-4" /> Download Answer
                      </a>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(s.createdAt)}
                  </div>
                </div>
                {/* Review Component!! */}
                <div className="mt-2">
                  {(s.score != null) || isReviwed ? (
                    <div className="text-sm text-emerald-400">
                      Reviewed: {s.score || score} pts — {s.review || review}
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReviewSubmit(s.submissionId);
                      }}
                      className="flex gap-2 mt-1"
                    >
                      <input
                        type="text"
                        name="score"
                        placeholder="Score"
                        value={score}
                        onChange={(e)=>setScore(Number(e.target.value))}
                        required
                        className="w-20 bg-slate-900/30 border border-slate-700/30 outline-none focus:border-cyan-500/40 rounded px-2 text-sm text-slate-200"
                      />
                      <input
                        type="text"
                        name="review"
                        placeholder="Feedback"
                        value={review}
                        onChange={(e)=>setReview(e.target.value)}
                        required
                        className="flex-1 bg-slate-900/30 border border-slate-700/30 outline-none focus:border-cyan-500/40rounded px-2 text-sm text-slate-200"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 cursor-pointer  active:scale-95 transition-all hover:opacity-90 rounded bg-gradient-to-r from-sky-600 to-cyan-600 text-white text-sm"
                      >
                        Save
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-400">No submissions yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherReviewSection;