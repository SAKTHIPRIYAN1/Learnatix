"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { Plus, FileIcon, Trash2 } from "lucide-react";

interface Note {
  notesId: string;
  name:string;
  description: string;
  notesPath: string;
  sender:string
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const NotesPage = ({ classId }: { classId: string }) => {
  const { user } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // form state
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      if (!user) return;
      setLoading(true);
      const res = await axios.post(`${API_URL}/notes`, {
        classId,
        userId: user.id,
      });
      console.log(res.data);
      const data = res.data as { msg: string; notes: Note[] };
      setNotes(data.notes || []);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [classId, user]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log(topic,file);

    if (!topic || !file) {
      toast.error("Please provide topic and file");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("classId", classId);
      formData.append("userId", user?.id || "");
      formData.append("description", topic);
      formData.append("file", file);
      formData.append("name",fileName?fileName:"File");

      await axios.post(`${API_URL}/notes/addNotes`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Note added!");
      setTopic("");
      setFile(null);
      setShowForm(false);
      fetchNotes();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload note");
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      console.log("Notes Deleted!!!");
    const res=await axios.delete(API_URL+'/notes/'+noteId);

      toast.success("Note deleted!");
      setNotes((prev) => prev.filter((n) => n.notesId !== noteId));
    } catch (err) {
      console.error(err);
      toast.error("Error deleting note");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        Loading notes...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 text-slate-200">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-300 border-b border-slate-700/40 pb-2">
          Notes
        </h2>
        {user?.unsafeMetadata?.role === "TEACHER" && (
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="w-10 cursor-pointer h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Add Form (TEACHER only) */}
      {showForm && user?.unsafeMetadata?.role === "TEACHER" && (
        <form
          onSubmit={handleAddNote}
          className="bg-slate-800/40 border border-slate-700/40 backdrop-blur-md p-4 rounded-xl space-y-4"
        >
        <input
            type="text"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-slate-900/40 border border-slate-700/40 text-slate-200 outline-none focus:border-cyan-500/40"
        />

          <label
            htmlFor="fileInput"
            className="cursor-pointer text-blue-500  hover:underline font-medium py-2 px-4 rounded-lg transition"
          >
            Browse File
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                console.log(file);

                setFile(e.target.files ? e.target.files[0] : null);

                setFileName(file ? file.name : null);
                
        }}
            />
        </label>

          {/* Show selected file name */}
          {fileName && (
            <span className="text-slate-300 text-sm truncate max-w-[200px]">
              {fileName}
            </span>
          )}

          <button
            type="submit"
            className=" ml-3 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 cursor-pointer hover:to-blue-600 transition text-white font-medium"
          >
            Upload Note
          </button>
        </form>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length > 0 ? (
          notes.map((note,idx) => (
            <div
              key={idx}
              className="relative flex items-center gap-4 bg-gradient-to-r from-slate-800/40 to-slate-900/20 border border-slate-700/40 backdrop-blur-md rounded-xl px-4 py-3 hover:border-cyan-500/30 transition group"
            >
              {/* File icon */}
              <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center">
                <FileIcon className="w-6 h-6 text-cyan-400" />
              </div>

              {/* File info */}
              <div className="flex flex-col">
                <span className="font-medium">{note.name}</span>
                <span className="text-sm text-slate-400">{note.description}</span>
                <a
                  href={API_URL+'/uploads/'+note.notesPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:underline mt-1"
                >
                  Download
                </a>
              </div>

              {/* Delete Button (TEACHER only, on hover) */}
              {user?.unsafeMetadata?.role === "TEACHER" && (
                <button
                  onClick={() => handleDelete(note.notesId)}
                  className="absolute right-3 top-3 p-1.5 rounded-md bg-red-600/70 hover:bg-red-600 transition opacity-0 cursor-pointer group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-slate-500 italic">No notes available</p>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
