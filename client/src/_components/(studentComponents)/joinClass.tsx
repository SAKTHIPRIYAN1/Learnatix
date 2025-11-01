"use client";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

import { useAppDispatch } from "@/store/hook";
import { addClassRoom } from "@/store/slices/usesrSlice";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

import toast from "react-hot-toast";
import { ClassRoomResponse } from '../../types/classRoom';


type FormType = {
  userId: string;
  magicSpell:string;
};

const JoinClassRoomComp = () => {
  const { user } = useUser();
  const [showForm, setShowForm] = useState(false);
  const dispatch=useAppDispatch();


// form data useState!!!
  const [formData, setFormData] = useState<FormType>({
    userId: "",
    magicSpell:""
  });

  const handleChange = (field: keyof FormType, value: string | File) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const joinClassRoom = async () => {
    
    try {
      
      if (!user?.id || !formData.magicSpell) {
        toast.error("Please fill all required fields.");
        return;
      }

      // prepare formData for backend
      const body = new FormData();
      
      body.append("magicSpell", formData.magicSpell);
      if(user){
        body.append("userId",user.id);
      }
      
      console.log(body);
      const res = await axios.post(API_URL+"/class/join",{
        userId:user.id,
        magicSpell:formData.magicSpell
      });
      console.log(res);
      

      const data= res.data as {msg:string,classRoom:ClassRoomResponse};
      dispatch(addClassRoom(data.classRoom));
      toast.success("Joined ClassRoom !");
      
      // reset and close
      setFormData({
        userId: "",
        magicSpell:""
      });

      setShowForm(false);

    } catch (err) {
      const data= err as {response:{data:{msg:string}}};
      setFormData({
        userId: "",
        magicSpell:""
      });
      toast.error(data.response.data.msg);
    }
  };

  return (
    <>
      {/* Button */}
      <div
        onClick={() => setShowForm(true)}
        className="absolute right-0 top-14 mt-2 mr-2 h-10 px-4 rounded-2xl flex items-center justify-center 
          border border-slate-600 
          bg-gradient-to-r from-cyan-400 to-blue-500 
          text-transparent bg-clip-text 
          hover:shadow-lg transition duration-200 ease-in-out
          cursor-pointer active:scale-95 hover:opacity-95"
      >
        <p className="text-xl font-bold cursor-pointer mr-2">+</p>
        <button className="text-sm font-semibold cursor-pointer ">
          Join ClassRoom
        </button>
      </div>

      {/* Popup */}
      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/75 z-50"
          onClick={() => setShowForm(false)} // close when clicking outside
        >
          <div
            className="relative text-secondary w-[500px] min-h-[300px]  rounded-2xl border border-slate-500/40 p-6 shadow-2xl
              backdrop-blur-lg bg-slate-400/10 "
            onClick={(e) => e.stopPropagation()} // stop closing when clicking inside
          >
            {/* Close button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-lg cursor-pointer bg-gradient-to-r from-blue-400 to-sky-500   hover:bg-red-500 bg-clip-text text-transparent font-bold"
            >
              ✕
            </button>
        

            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-center mb-4">
              Join Classroom
            </h2>

            <form className="space-y-4"
            onSubmit={(e)=>{
                e.preventDefault();

                // create the ClassRoom.
                joinClassRoom();
            }}
            >
              <div>
                <label className="block text-secondary font-medium text-sm mb-2">UserId</label>
                <div
                  className=" select-none w-full px-3 py-2 rounded-lg bg-slate-950/20 border border-slate-400/40 
                    focus:outline-none focus:ring-1 focus:ring-blue-500"
                >user_xxxxxx_autoFill_xxx</div>
              </div>

              
              <div>
            <label className="block text-secondary font-medium  text-sm mb-2">Magicspell</label>
                <textarea
                required
                  value={formData.magicSpell}
                  onChange={(e) => handleChange("magicSpell", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/20 border border-slate-400/40 
                    focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 
                  text-white font-semibold hover:opacity-90 active:scale-98 transition cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default JoinClassRoomComp;
