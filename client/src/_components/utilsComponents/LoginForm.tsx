"use client";

import React from "react";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TeacherIcon from "./TeacherIcon";
import ArrowIcon from "./sgn";

const Login = () => {
  const router = useRouter();
  return (
    <div className="text-[15px] z-[2] border border-slate-700 w-[500px] bg-[rgba(6,11,22,0.46)] rounded-lg p-6 flex flex-col items-center justify-center">
      <h1 className="text-white text-4xl mb-4">User Login</h1>

      {/* While Clerk is initializing */}
      <ClerkLoading>
        <div className="flex items-center justify-center h-40">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-500 border-t-white" />
          <p className="ml-3 text-gray-300">Loading login...</p>
        </div>
      </ClerkLoading>

      {/* When Clerk is ready */}
      <ClerkLoaded>
        <SignIn.Root >
          <SignIn.Step
            name="start"
            className="flex text-[15px] text-secondary flex-col items-center justify-center w-full"
          >
            {/* Email field */}
            <Clerk.Field name="identifier" className="flex flex-col w-full gap-2 mb-4">
              <Clerk.Label>Email</Clerk.Label>
              <Clerk.Input
                placeholder="your@email.com"
                className="outline-none focus:ring-2 placeholder:text-secondary text-primary focus:ring-blue-800 pl-4 bg-[rgb(3,7,20)] h-10 border border-neutral-800 rounded-lg"
              />
              <Clerk.FieldError className="text-red-500 ml-1" />
            </Clerk.Field>

            {/* Password field */}
            <Clerk.Field name="password" className="flex flex-col w-full gap-2 mb-4">
              <div className="flex items-center justify-between">
                <Clerk.Label>Password</Clerk.Label>
                <SignIn.Action
                  navigate="forgot-password"
                  className="text-slate-200 font-semibold underline hover:cursor-pointer hover:text-slate-300"
                >
                  Forgot password?
                </SignIn.Action>
              </div>
              <Clerk.Input
                type="password"
                placeholder="Enter your password"
                className="pl-4 placeholder:text-secondary text-primary bg-[rgb(3,7,20)] outline-none focus:ring-2 focus:ring-blue-800 h-10 border border-neutral-800 rounded-lg"
              />
              <Clerk.FieldError className="text-red-500" />
            </Clerk.Field>

            {/* Hidden role */}
            <Clerk.Field name="unsafeMetadata.role" className="hidden">
              <Clerk.Input type="hidden" value="student" />
            </Clerk.Field>

            {/* Submit button */}
            <SignIn.Action
              submit
              className="mt-4 active:scale-98 transition-all h-12 w-full hover:cursor-pointer bg-slate-100 font-medium mb-1 text-black rounded-lg hover:bg-slate-200"
            >
              Sign in
            </SignIn.Action>

            {/* Redirect to SignUp */}
            <p className="text-primary mt-2">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up/student"
                className="underline decoration-slate-400 hover:cursor-pointer font-semibold"
              >
                Sign Up
              </Link>
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center w-full mt-3 gap-2">
              <div className="border-b border-gray-600 w-full" />
              <p className="text-gray-400 text-center">or</p>
              <div className="border-b border-gray-600 w-full" />
            </div>

            

            {/* Teacher Login */}
            <div
              className="mt-3 w-full hover:cursor-pointer active:scale-98 hover:opacity-85 transition-all text-primary font-semibold bg-[rgb(3,7,20)] flex items-center justify-center h-10 border gap-3 border-neutral-800 rounded-lg"
              onClick={() => router.push("/sign-in/teacher")}
            >
              <TeacherIcon className="w-5 h-5 text-blue-500" />
              Continue as Teacher
            </div>

            <div
            className="mt-3 w-full hover:cursor-pointer active:scale-98 hover:opacity-85 transition-all  text-primary font-semibold bg-[rgb(3,7,20)] flex items-center justify-center h-10 border gap-3 border-neutral-800 rounded-lg"
            onClick={() => {
              router.push('/sign-up/teacher');
            }}
          >
            <ArrowIcon className="w-5 h-5 text-white" />
            Continue with sign-up
          </div>
          </SignIn.Step>
        </SignIn.Root>
        
      </ClerkLoaded>
    </div>
  );
};

export default Login;
