"use client";
import { useUser } from "@clerk/nextjs"; 
import { useEffect, useState } from "react";
import axios from "axios";



const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// store!!!
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setName } from "@/store/slices/usesrSlice";


type UserType = {
  clerkId: string;
  name: string | null;
  email: string;
  imageUrl: string;
  role: "STUDENT" | "TEACHER ";
};

const Header = () => {

  const dispatch=useAppDispatch();
  const userName=useAppSelector((store)=>store.user.name);

  const { isLoaded, user } = useUser();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);


  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchUser = async () => {

      console.log("Fetching user data for:", user);
      
      setCurrentUser({
        clerkId: user.id,
        name: userName,
        email: user.emailAddresses[0]?.emailAddress || "",
        imageUrl: user.imageUrl || "",
        role: "STUDENT",
      });

      if(userName == null){
          try {
          console.log("Header Calling the Server for name");
          const res = await axios.get(`${API_URL}/users/${user.id}`);
          const data = res.data as { name?: string };
          dispatch(setName((data?.name as string)));
        } catch (err) {
          console.error("Failed to fetch user:", err);
          dispatch(setName("YourName"));
        }
      }
    };

    fetchUser();
  }, [isLoaded, user]);

  if (!isLoaded || !currentUser) {
    return (
      <header className="fixed h-14 gap-2 bg-gray-950 border-b border-b-gray-700 top-0 left-0 z-50 w-full p-4 text-white flex justify-end items-center">
        <div className="animate-pulse w-44 h-full bg-gray-500"></div>
        <div className="animate-pulse rounded-full w-10 h-10 bg-gray-500"></div>
      </header>
    );
  }

  return (
    <header className=" select-none fixed h-14 bg-gray-950 border-b-[0.5px] border-b-slate-800 top-0 z-50 w-full p-4 text-white flex justify-between items-center">
      <div>
        <h1 className="text-[23px]  font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
            Quizzyy
        </h1>
      </div>
      <div className="flex w-full gap-1 h-14  items-center justify-end ">
        <div className="group cursor-pointer relative flex items-center self-center   text-sky-800 dark:text-sky-300">
            <h1 className=" text-sm p-1 px-2 border border-dashed border-sky-300/60 bg-sky-400/10 group-hover:bg-sky-400/15 dark:border-sky-300/30">
            {userName ||currentUser.email}
            <svg width="5" height="5" viewBox="0 0 5 5" className="absolute top-[-2px] left-[-2px] fill-sky-300 dark:fill-sky-300/50"><path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path></svg>
            <svg width="5" height="5" viewBox="0 0 5 5" className="absolute top-[-2px] right-[-2px] fill-sky-300 dark:fill-sky-300/50"><path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path></svg>
            <svg width="5" height="5" viewBox="0 0 5 5" className="absolute bottom-[-2px] left-[-2px] fill-sky-300 dark:fill-sky-300/50"><path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path></svg>
            <svg width="5" height="5" viewBox="0 0 5 5" className="absolute right-[-2px] bottom-[-2px] fill-sky-300 dark:fill-sky-300/50"><path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path></svg>
            </h1>
        </div>
        
      {currentUser.imageUrl && (
        <img
          src={currentUser.imageUrl}
          alt="Profile"
          className=" hover:cursor-pointer hover:opacity-70 transition-all rounded-full w-10 h-10 ml-4 object-cover"
        />
      )}
      </div>
    </header>
  );
};

export default Header;
