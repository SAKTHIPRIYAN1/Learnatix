"use client";

import React, {  useEffect, useState } from "react";
import {  Download } from "lucide-react";
import toast from "react-hot-toast";
import {Task } from "@/types/taskRelatedTypes";
import axios from "axios";

const API_URL=process.env.NEXT_PUBLIC_BACKEND_URL;
/* ---------------------- Helpers ------------------------ */
const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString();
};


/* ---------------- Teacher Review Subcomponent ---------------- */
const TeacherReviewSection = ({ task,userId }: { task: Task,userId:string }) => {
  const [expanded, setExpanded] = useState(false);
  console.log(task);

  const handleReviewSubmit = (submissionId: string, score: number, review: string,studentId:string) => {
    console.log("Teacher Reviewed!!!");
    toast.success(`Reviewed : ${score} pts - "${review}"`);
  };

  useEffect( ()=>{
    // get all Submissions for the task..
    async function fetchSubmissions(){
      if(!task || !task.taskId)
        return;
      try{
          const res=await axios.get(`${API_URL}/task/submissions/${task.taskId}/${userId}`);

          console.log("Submission fetched:",res.data);
          const data=res.data as {msg:string,submissions:Task["submission"]};
        }
        catch(err){
          console.log(err);
          toast.error("Error fetching submissions");
        }
    }

    fetchSubmissions();

  }, [task])
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
          {task.submission && task.submission.length > 0 ? (
            task.submission.map((s) => (
              // actual task of the sudent!!!
              <div
                key={s.id}
                className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30"
              >
                {/* the students task and content */}
                <div className="flex justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium text-slate-300">
                      {s.student?.name ?? s.studentId}
                    </div>
                    <div className="text-xs text-slate-400">{s.text}</div>
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
                  {s.score != null ? (
                    <div className="text-sm text-emerald-400">
                      Reviewed: {s.score} pts — {s.review}
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();

                        // Preprocessing the text in the form!!!
                        const form = e.currentTarget;
                        const score = Number((form.elements.namedItem("score") as HTMLInputElement).value);
                        const review = (form.elements.namedItem("review") as HTMLInputElement).value;
                        handleReviewSubmit(s.id, score, review,s.studentId);
                      }}
                      className="flex gap-2 mt-1"
                    >
                      <input
                        type="text"
                        name="score"
                        placeholder="Score"
                        required
                        className="w-20 bg-slate-900/30 border border-slate-700/30 outline-none focus:border-cyan-500/40 rounded px-2 text-sm text-slate-200"
                      />
                      <input
                        type="text"
                        name="review"
                        placeholder="Feedback"
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