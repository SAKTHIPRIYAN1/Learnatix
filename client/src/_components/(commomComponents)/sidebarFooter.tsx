"use client";
import { useUser } from "@clerk/nextjs"; 
import { useEffect, useState } from "react";
import axios from "axios";
import IconLogout from "../(Icons)/logOutIcon";
import { useClerk } from '@clerk/nextjs'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type UserType = {
  clerkId: string;
  name: string;
  email: string;
  imageUrl: string;
  role: "STUDENT" | "TEACHER" |"";
};


const SideBarFooter = () => {

  const {signOut} =useClerk();
  const { isLoaded, user } = useUser();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchUser = async () => {
      const baseUser: UserType = {
        clerkId: user.id,
        name: user.fullName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
        imageUrl: user.imageUrl || "",
        role: "",
      };

      try {
        const res = await axios.get(`${API_URL}/users/${user.id}`);
        const data = res.data as { name?: string, role?: "STUDENT" | "TEACHER" | "" };
        console.log("Fetched user data:", data);
        setCurrentUser({
          ...baseUser,
          name: data.name ?? baseUser.name,
          role: data.role ?? baseUser.role,
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setCurrentUser(baseUser);
      }
    };

    fetchUser();
  }, [isLoaded, user]);

  if (!isLoaded || !currentUser) {
    return (
      <footer className="cursor-pointer z-normal pt-2 flex bg-transparent gap-3 border-t border-t-slate-500 w-full animate-pulse">
       
        <div className="h-10 w-10 rounded-full bg-slate-700" />

        <div className="w-full flex justify-between pr-4">
          <div className="flex-col space-y-2">
           
            <div className="h-4 w-20 rounded bg-slate-700" />
           
            <div className="h-3 w-10 rounded bg-slate-600" />
          </div>
          <div className="flex h-10 w-10 rounded-lg bg-slate-700 border-[2px] border-slate-600" />
        </div>
      </footer>

    );
  }




  return (
    <footer className="  cursor-pointer z-normal pt-3 flex bg-transparent gap-3 border-t-[0.8px] border-t-slate-500 w-full">
        <img src={currentUser.imageUrl} alt="profile" className="h-9 w-9 rounded-full" />
        <div className="w-full flex justify-between pr-4">
            <div className=" mt-[-3px] flex-col text-sm">
            <h1 >
                {currentUser.name}
            </h1>
            <h1 className="text-gray-500 text-[12px] font-medium  overflow-clip  ">
                {currentUser.role}
            </h1>
            </div>

{/* sign out in footer.!! */}
            <div onClick={()=>{
              signOut({redirectUrl:"/"})
              console.log("Logout clicked");
            }} className="flex h-9 w-9 border-[2px] hover:cursor-pointer active:scale-95 transition-all hover:opacity-100  opacity-70 border-slate-600 bg-slate-950/40 rounded-lg  items-center justify-center">
                <IconLogout className=" self-center" />
            </div>
        </div>
    </footer>
  );
};

export default SideBarFooter;
