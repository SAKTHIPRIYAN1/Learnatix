"use client";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

import toast from "react-hot-toast";

type FormType = {
  className: string;
  teacherName: string;
  description: string;
  file?: File;
};

const CreateClassRoomComp = () => {
  const { user } = useUser();
  const [showForm, setShowForm] = useState(false);
  
//   form data useState!!!
  const [formData, setFormData] = useState<FormType>({
    className: "",
    teacherName: "",
    description: "",
    file: undefined,
  });

  const handleChange = (field: keyof FormType, value: string | File) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const CreateClassRoom = async () => {
    
    try {
      if (!formData.className || !formData.teacherName || !formData.description) {
        toast.error("Please fill all required fields.");
        return;
      }

      // prepare formData for backend
      const body = new FormData();
      body.append("className", formData.className);
      body.append("teacherName", formData.teacherName);
      body.append("description", formData.description);

      if(user){
        body.append("teacherId",user.id);
      }
      
      if (formData.file) {
        body.append("pic", formData.file);
      }
      
      const res = await axios.post(API_URL+"/class/create",body);
      toast.success("ClassRoom Created!");
      // reset and close
      setFormData({
        className: "",
        teacherName: "",
        description: "",
        file: undefined,
      });
      setShowForm(false);

    } catch (err) {
      toast.error("Error creating classroom");
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
          New ClassRoom
        </button>
      </div>

      {/* Popup */}
      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/75 z-50"
          onClick={() => setShowForm(false)} // close when clicking outside
        >
          <div
            className="relative text-secondary w-[500px] min-h-[500px]  rounded-2xl border border-slate-500/40 p-6 shadow-2xl
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
              Create Classroom
            </h2>

            <form className="space-y-4"
            onSubmit={(e)=>{
                e.preventDefault();

                // create the ClassRoom.
                CreateClassRoom();
            }}
            >
              <div>
                <label className="block text-secondary font-medium text-sm mb-2">Classroom Name</label>
                <input
                  required
                  type="text"
                  value={formData.className}
                  onChange={(e)=>{handleChange("className",e.target.value)}}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/20 border border-slate-400/40 
                    focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-secondary font-medium  text-sm mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleChange("file", e.target.files ? e.target.files[0] : "")
                  }
                  className="w-full text-sm text-slate-200 file:mr-3 file:py-1 file:px-3 
                    file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                />
              </div>

              <div>
                <label className="block text-secondary font-medium  text-sm mb-2">Description</label>
                <textarea
                required
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/20 border border-slate-400/40 
                    focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-secondary font-medium  text-sm mb-2">Teacher Name</label>
                <input
                  type="text"
                  value={formData.teacherName}
                  onChange={(e)=>{handleChange("teacherName",e.target.value)}}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/20 border border-slate-400/40 
                    focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 
                  text-white font-semibold hover:opacity-90 active:scale-98 transition cursor-pointer"
                  
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateClassRoomComp;
