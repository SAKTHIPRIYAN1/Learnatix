"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Participant } from "@/types/classRoom";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

interface ParticipantsResponse {
    teachers: Participant[]
    students: Participant[]
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ParticipantsPage = ({ classId }: { classId: string }) => {
  
    const {user}=useUser();
  const [data, setData] = useState<ParticipantsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        if(!user)
            return;
    
        setLoading(true);
        const res = await axios.post(
          `${API_URL}/participants`,
          {
            classId,
            userId:user.id
          }
        );

        const data=(res.data as {msg:string,participants:ParticipantsResponse});
        console.log(data.participants);
        setData(data.participants);
      } catch (err) {
        console.error(err);
        toast.error("Error in Fetching participants");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [classId,user]);

  if (loading) {
    return (
      <ParticipantsSkeletonLoader />
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center mt-4 h-full text-red-400">
        {"No participants found."}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 text-slate-200">
      {/* Teachers */}
      <section>
        <h2 className="text-lg font-semibold text-slate-300 border-b border-slate-700/40 pb-2 mb-4">
          Teachers
        </h2>
        {data.teachers.length > 0 ? (
          <ul className="space-y-3">
            {data.teachers.map((t) => (
              <li
                key={t.id}
                className="flex mt-1 items-center gap-3 bg-gradient-to-r from-sky-800/20 to-blue-800/20 cursor-pointer backdrop-blur-md border border-slate-700/40 rounded-xl px-4 py-2 hover:border-cyan-500/40 transition"
              >
                <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 text-sm font-medium">
                    {t.user.name[0].toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{t.user.name}</span>
                  <span className="text-xs text-slate-400">{t.user.email}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 italic">No teachers found</p>
        )}
      </section>

      {/* Students */}
      <section>
        <h2 className="text-lg font-semibold text-slate-300 border-b border-slate-700/40 pb-2 mb-4">
          Students
        </h2>
        {data.students.length > 0 ? (
          <ul className="space-y-3">
            {data.students.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 bg-gradient-to-r mt-1 from-violet-800/20 to-fuchsia-800/20 backdrop-blur-md border border-slate-700/30 rounded-xl px-4 py-2 hover:border-fuchsia-500/30 cursor-pointer transition"
              >
                <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 text-sm font-medium">
                  {s.user.name[0].toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{s.user.name}</span>
                  <span className="text-xs text-slate-400">{s.user.email}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 italic">No students found</p>
        )}
      </section>
    </div>
  );
};



const ParticipantsSkeletonLoader = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Teachers Skeleton */}
      <section>
        <h2 className="text-lg font-semibold text-slate-500 border-b border-slate-700/40 pb-2 mb-4">
          Teachers
        </h2>
        <ul className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <li
              key={i}
              className="flex items-center gap-3 bg-slate-800/30 backdrop-blur-md border border-slate-700/30 rounded-xl px-4 py-2 animate-pulse"
            >
              <div className="w-10 h-10 rounded-full bg-slate-700/50" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3 w-32 bg-slate-700/40 rounded" />
                <div className="h-2 w-20 bg-slate-700/30 rounded" />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Students Skeleton */}
      <section>
        <h2 className="text-lg font-semibold text-slate-500 border-b border-slate-700/40 pb-2 mb-4">
          Students
        </h2>
        <ul className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="flex items-center gap-3 bg-slate-800/20 backdrop-blur-md border border-slate-700/30 rounded-xl px-4 py-2 animate-pulse"
            >
              <div className="w-10 h-10 rounded-full bg-slate-700/50" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3 w-32 bg-slate-700/40 rounded" />
                <div className="h-2 w-20 bg-slate-700/30 rounded" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ParticipantsPage;
