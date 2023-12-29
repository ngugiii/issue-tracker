"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   try {
  //     const { data } = await axios.post("/api/login", {
  //       email,
  //       password,
  //     });
  //     console.log(data);
  //     toast.success("Login Successfull!");
  //     router.push("/");
  //   } catch (error) {
  //     toast.error("Error Logging In");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect:false
      });
      if(res?.error){
        toast.error("Invalid Login Attempt");
      }
      else if(!res?.error){
        console.log(res);
        const session = await getSession();
        console.log(session);
        
        toast.success("Login Successfull!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Error Logging In");
    }
  };
  return (
    <div className="flex justify-center items-center h-[80vh] w-full">
      <div className="shadow-lg p-5 md:w-[30%] w-[90%] rounded-lg border-t-4 border-gray-800">
        <h1 className="text-xl font-bold my-4 text-center">
          Sign In to your account
        </h1>
        <form onSubmit={handleSubmit} action="" className="flex flex-col gap-3">
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
            Don't have an account? <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default page;
