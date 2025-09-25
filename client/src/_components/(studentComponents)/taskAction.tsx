"use client";


import {Task } from "@/types/taskRelatedTypes";

import React, {useState } from "react";
import {Download } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

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
  task,
  currentUserId,
}: {
  task: Task;
  currentUserId: string;
}) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const mySubmission =
    task.submission?.find((s) => s.studentId === currentUserId) ?? null;
  const duePassed = isPastDue(task.dueDate);

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
      submissionData.append("review",text);
      if(file)
        submissionData.append("file",file);
      const res =await axios.post(`${API_UPL}/task/submit`,submissionData);
      console.log("Submission response:", res.data);
      toast.success("Task Submitted Successfully!");
      setSubmitting(false);
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
              <div className="text-xs text-slate-400">
                {mySubmission.text ?? "No text"}
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
            handleSubmit(e,task.taskId);
          }
          } className="flex flex-col gap-2">
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              duePassed ? "Submission closed (past due)" : "Write your Review..."
            }
            className="resize-none bg-slate-900/30 border border-slate-700/30 rounded p-2 text-slate-200 outline-none"
          />
          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-gradient-to-r from-sky-600 to-cyan-600 px-3 py-1 rounded text-white text-sm">
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
              className="ml-auto px-3 py-1 rounded bg-gradient-to-r cursor-pointer from-indigo-600 to-blue-600 text-white disabled:opacity-50"
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