"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Plus, Trash2, Download } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

import StudentTaskActions from "../(studentComponents)/taskAction";
import TeacherReviewSection from "../(teacherComponents)/TeachertaskAction";

import { Task, Role } from "@/types/taskRelatedTypes";

// /store operations and functions!!
import { setTasks,addTask,deleteTask } from "@/store/slices/classRoomSlice";
import { useAppDispatch,useAppSelector } from "@/store/hook";

import { useSocket } from "@/lib/socket/socketProvider";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/* ----------------- Helpers ---------------- */
const isPastDue = (due?: string | null) => {
  if (!due) return false;
  return new Date(due).getTime() < new Date().getTime();
}

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString() : "—";

/* ----------------- Component ---------------- */
const TaskComponent = ({ classId }: { classId: string }) => {
  const dispatch=useAppDispatch();
  const tasks=useAppSelector((store)=>store.classroom.tasks)
  const { isLoaded, user } = useUser();
  const role: Role = (user?.unsafeMetadata?.role as Role) ?? "STUDENT";
  const userId = user?.id ?? "";

  const [isTaskLoaded, setTaskLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("assignment");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);


  // socket for the RealTime Updatioon of task of the ClassRoom!!!
  const {socket}=useSocket();
  
  useEffect(()=>{
    if(!socket || !classId)
      return;

    // real time task addition and deletion!!!
    const handleAddTask=(data:{classId:string,senderId:string,task:Task})=>{
      if(classId!=data.classId || data.senderId==user?.id)
        return;
      console.log("New Task from Socket:",data);
      dispatch(addTask(data.task));
    };

    const handleDeleteTask=(data:{classId:string,senderId:string,taskId:string})=>{
      if(classId!=data.classId || data.senderId==user?.id)
        return;
      console.log("Task Deleted from Socket:",data);
      dispatch(deleteTask({taskId:data.taskId} as Task));
    }


    // socket for actionsss
    socket.on("addTask",handleAddTask);
    socket.on("deleteTask",handleDeleteTask);

    return()=>{
      socket.off("addTask",handleAddTask);
      socket.off("deleteTask",handleDeleteTask);
    }

  },[socket,classId,user,dispatch]);

  // Fetch tasks
  useEffect(() => {
    async function fetchTasks() {
      if (!user) return;
      try {
        const res= await axios.get(`${API_URL}/task/get/${classId}/${user.id}`);
        const data = res.data as {msg:string,tasks:Task[]};
        dispatch(setTasks(data.tasks));
        console.log("Task fetched:", res.data);
      } catch (err) {
        console.log(err);
        toast.error("Error fetching tasks");
      } finally {
        setTaskLoaded(true);
      }

    }
    fetchTasks();
  }, [classId, user]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description ||!dueDate || !file) {
      toast.error("Name & description are required");
      return;
    }

    try{
      const formData= new FormData();
      formData.append("name",name);
      formData.append("description",description);
      formData.append("dueDate",new Date(dueDate).toISOString());
      formData.append("teacherId",userId);
      formData.append("classId",classId);
      formData.append("file",file);

      const res=await axios.post(`${API_URL}/task/create`,formData);
      console.log("Task created:",res.data);

      const data =res.data as {msg:string,task:Task};
      dispatch(addTask(data.task))
      toast.success("Task Created Successfully");

    } catch (err) {
      console.log(err);
      toast.error("Error in creating Task");
    }
    finally{
      setDueDate("");
      setDescription("");
      setName("");
      setFile(null);
    }

    setShowForm(false);

  };


  const handleDeleteTask = async (taskId:string) => {
    console.log(taskId);
    if(!taskId){
      toast.error("Task ID missing!");
      return;
    }

    if(!user || !userId)
        return;

    try {
      const res= await axios.delete(`${API_URL}/task/delete/${taskId}/${userId}/${classId}`);
      console.log("Task deleted:",res.data);

      dispatch(deleteTask({taskId:taskId} as Task));

      toast.success("Task Deleted Successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task");
    }
  };

  if (!isTaskLoaded) return <h1>Loading Tasks…</h1>;

  if (!isLoaded) return <h1>Loading…</h1>;

  return (
    <div className="p-6 space-y-6 text-slate-200 ">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-300">Tasks</h2>

        {role === "TEACHER" && (
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="w-10 cursor-pointer h-10 active:scale-95 transition-all hover:opacity-90 
                       rounded-full flex items-center justify-center 
                       bg-gradient-to-r from-sky-600 to-cyan-500 hover:scale-105"
            title="Create Task"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Task Creation Form (inline, ) */}
      {role === "TEACHER" && showForm && (
        <form
          onSubmit={handleCreateTask}
          className="bg-slate-800/40 border outline-none focus:border-cyan-500/40 border-slate-700/30 
                     p-4 rounded-xl space-y-3"
        >
          <input
            type="text"
            placeholder="Task Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 rounded bg-slate-900/30 
                       border outline-none focus:border-cyan-500/40 border-slate-700/30 text-slate-200"
          />
          <textarea
            placeholder="Description"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-slate-900/30 
                       border outline-none focus:border-cyan-500/40 border-slate-700/30 text-slate-200"
          />
          <div className="flex gap-2">
            <select
              value={type}
              required
              onChange={(e) => setType(e.target.value)}
              className="p-2 rounded bg-slate-900/30 
                         border outline-none focus:border-cyan-500/40 border-slate-700/30 text-slate-200"
            >
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
            </select>
            <input
              type="datetime-local"
              value={dueDate}
              required
              onChange={(e) => setDueDate(e.target.value)}
              className="p-2 rounded bg-slate-900/30 
                         border outline-none focus:border-cyan-500/40 border-slate-700/30 text-slate-200"
            />
          </div>
          <label className="cursor-pointer text-sm  text-cyan-400 mr-4 hover:underline">
            Attach File
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {file && (
            <p className="text-xs  text-slate-400">Selected: {file.name}</p>
          )}

          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-gradient-to-r 
                       from-sky-600 cursor-pointer to-blue-600 text-white hover:opacity-90"
          >
            Create Task
          </button>
        </form>
      )}


      {/* Task List */}
      <div className="space-y-4">
        {
          tasks.length === 0 ? (
            <p className="text-sm text-slate-400">No tasks Posted.</p>
          ) : (tasks.map((task) => (
          <div
            key={task.taskId}
            className={`p-4 rounded-xl bg-slate-800/30 border cursor-pointer hover:border-slate-500 hover ${
              isPastDue(task.dueDate) && role === "STUDENT"
                ? "border-red-500/50"
                : "border-slate-700/30"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-semibold">{task.name}</h3>
                <p className="text-sm text-slate-400">{task.description}</p>
                <p
                  className={`text-xs mt-1 ${
                    isPastDue(task.dueDate) && role === "STUDENT" ? "text-red-400" : "text-slate-400"
                  }`}
                >
                  Due: {formatDate(task.dueDate)}
                </p>

                {task.filePath && (
                  <a
                    href={API_URL +'/uploads/' + task.filePath}
                    className="text-sm mt-2 flex gap-1 items-center 
                               bg-gradient-to-r from-cyan-500 to-blue-500 
                               bg-clip-text text-transparent hover:underline"
                    target="_blank" rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 text-cyan-500" /> View File
                  </a>
                )}
              </div>

              {role === "TEACHER" && (
                <button
                  onClick={() => handleDeleteTask(task.taskId)}
                  className="text-red-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {role === "STUDENT" && (!isPastDue(task.dueDate) ?(
              <StudentTaskActions taskId={task.taskId} currentUserId={userId} />
            )
            : <p className="text-sm text-red-400 font-medium mt-2">
               Due Date Passed!
            </p>)
            }
            {role === "TEACHER" && (
              <TeacherReviewSection taskId={task.taskId}  userId={userId} />
            )}
          </div>
        ))
      )
      }
      </div>
    </div>
  );
};

export default TaskComponent;
