"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getSession, useSession } from "next-auth/react";
import Loader from "../components/loader/Loader";

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (password !== cPassword) {
      toast.error("Passwords do not Match");
      setIsLoading(false);
    }
    try {
      const response = await axios.post("/api/register", {
        userName,
        email,
        password,
      });
      toast.success(
        "Account Created Succesfully, Enter your details to log in"
      );
      setIsLoading(false);
      router.push("/");
    } catch (error) {
      toast.error("Problem creating Account");
      setIsLoading(false);
    }
  };

  return (
    <>
    {isLoading && <Loader/>}
    <div className="flex justify-center items-center h-[80vh] w-full">
      <div className="shadow-lg p-5 md:w-[30%] w-[90%] rounded-lg border-t-4 border-gray-800">
        <h1 className="text-xl font-bold my-4 text-center">
          Create a new account
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter your User name"
            className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="email"
            name=""
            id=""
            placeholder="Enter your email"
            className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name=""
            placeholder="Enter your Password"
            id=""
            className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            name=""
            placeholder="Confirm your Password"
            id=""
            className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
            onChange={(e) => setCPassword(e.target.value)}
            required
          />
          <button className="w-full bg-gray-800 text-white px-2 py-1 rounded-md">
            Register
          </button>
          {/* <div className="bg-red-500 text-white w-fit text-sm rounded-md mt-2 p-1">Error Message</div> */}
          <Link className="text-sm" href={"/"}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
    </>
  );
};

export default Page;
