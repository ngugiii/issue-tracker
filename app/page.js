"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Loader from "./components/loader/Loader";


const Page = ({searchParams}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const determineCallbackUrl =() => {
      if (email === "admin@gmail.com") {
        return searchParams.callbackUrl ? searchParams.callbackUrl : getBaseUrl() + "/dashboard";
      } else {
        return searchParams.callbackUrl ? searchParams.callbackUrl : (id && (getBaseUrl() + `/user-issues/${id}`));
      }
    
  };
  
  const getBaseUrl = () => {
    return process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://myissue-tracker.vercel.app";
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
  
      if (res?.error) {
        console.error(res.error);
        setIsLoading(false);
      } else {
        const session = await getSession();
        console.log("Session after login:", session);
        setId(session.userId)
        setIsLoading(false);
  
        router.push(determineCallbackUrl());
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  
  return (
    <>
      {isLoading && <Loader />}
      <div className="flex justify-center items-center h-[80vh] w-full">
        <div className="shadow-lg p-5 md:w-[30%] w-[90%] rounded-lg border-t-4 border-gray-800">
          <h1 className="text-xl font-bold my-4 text-center">
            Sign In to your account
          </h1>
          <form
            onSubmit={handleSubmit}
            action=""
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              name=""
              placeholder="Enter your email"
              className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name=""
              placeholder="Enter your Password"
              className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-gray-800 text-white px-2 py-1 rounded-md">
              Login
            </button>
            {/* <div className="bg-red-500 text-white w-fit text-sm rounded-md mt-2 p-1">Error Message</div> */}
            <Link className="text-sm" href={"/signup"}>
              Don&apos;t have an account?{" "}
              <span className="underline">Register</span>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
