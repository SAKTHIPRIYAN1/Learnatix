'use client'

import React, { useState,useEffect } from "react";
import { useSignUp, useSignIn,useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image"; 
import Link from "next/link"; // Use Link for navigation
import axios from "axios";

import SpinLoader from "../utilsComponents/spinLoader";

import toast from "react-hot-toast";

// this is the sign-up form!!
// back url;

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SignUpForm = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signIn } = useSignIn(); // for OAuth
  const router = useRouter();

  const [username, setUsername] = useState(""); // only for DB
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const extraData = { role: "STUDENT" };

  const { isSignedIn, user } = useUser(); //

 
  if (!isLoaded) return <SpinLoader />;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: extraData,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Signup failed");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const complete = await signUp.attemptEmailAddressVerification({ code });

      if (complete.status === "complete" && complete.createdSessionId) {
        await setActive({ session: complete.createdSessionId });

        console.log("User verified!");
        console.log("Username (for DB):", username);
        console.log("Email:", email);
        console.log("Clerk metadata:", extraData);

        const clerkId= complete.createdUserId;
        // sending to the backend...
        const res = await axios.post(`${API_URL}/signup`, {
          name: username,
          clerkId,
          email,
          role: extraData.role
        },{
          withCredentials:true
        });

        console.log("User data saved to DB:", res.data);
        toast.success("Account Created Successfully");
        router.push("/dashboard"); // redirect after verification
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Error Occured");
      setError(err.errors?.[0]?.message || "Verification failed");
    }
  };

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-[rgb(6,11,22)]">
      <div className="text-[15px] z-[2] border border-slate-700 w-[450px] bg-[rgba(6,11,22,0.46)] rounded-lg p-6 flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl mb-4">Create an account</h1>

        {!pendingVerification ? (
          <form onSubmit={handleSignUp} className="flex flex-col w-full gap-4">
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-white">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="pl-4 bg-[rgb(3,7,20)] placeholder:text-secondary text-primary outline-none focus:ring-2 focus:ring-blue-800 h-10 border border-neutral-800 rounded-lg"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="pl-4 bg-[rgb(3,7,20)] placeholder:text-secondary text-primary outline-none focus:ring-2 focus:ring-blue-800 h-10 border border-neutral-800 rounded-lg"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="pl-4 bg-[rgb(3,7,20)] placeholder:text-secondary text-primary outline-none focus:ring-2 focus:ring-blue-800 h-10 border border-neutral-800 rounded-lg"
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div id="clerk-captcha" data-cl-theme="dark" data-cl-size="flexible" data-cl-language="en-US" />

            <button
              type="submit"
              className="mt-1 h-12 w-full bg-slate-100 text-black font-medium rounded-lg hover:bg-slate-200 hover:cursor-pointer active:scale-98 transition-all"

              onClick={()=>{}}
            >
              Create Account
            </button>

            <p className="text-primary mt-1 text-center">
              Already have an account?{" "}
              <Link href="/" className="underline decoration-slate-400 font-semibold">
                Sign In
              </Link>
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center w-full mt-0 gap-2">
              <div className="border-b border-gray-600 w-full" />
              <p className="text-gray-400 text-center">or</p>
              <div className="border-b border-gray-600 w-full" />
            </div>

            
          </form>
        ) : (
          // Verification step
          <form onSubmit={handleVerify} className="flex flex-col w-full gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-secondary ">Email Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
                required
                className="pl-4 bg-[rgb(3,7,20)] placeholder:text-secondary text-primary outline-none focus:ring-2 focus:ring-blue-800 h-10 border border-neutral-800 rounded-lg"
              />
            </div>

            {error && <p className="text-red-500">Error Occured</p>}

            <button
              type="submit"
              className=" hover:cursor-pointer mt-4 h-12 w-full bg-slate-100 text-black font-medium rounded-lg hover:bg-slate-200 active:scale-98 transition-all"
            >
              Verify Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;
