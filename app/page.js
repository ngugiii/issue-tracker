"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Loader from "./components/loader/Loader";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("https://myissue-tracker.vercel.app/dashboard");


  useEffect(() => {
    const path = window.location.href;
    const encodedUrl = path;
    const decodedUrl = decodeURI(encodedUrl);
    const parsedUrl = new URL(decodedUrl);
    const urlParams = new URLSearchParams(parsedUrl.search);
    setCallbackUrl(urlParams.get("callbackUrl"));
  }, [])
  
  console.log(callbackUrl);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl:
          callbackUrl ||  "http://localhost:3000/dashboard" || "https://myissue-tracker.vercel.app/dashboard",
      });
      if (res.status !== 200) {
        toast.error("Invalid Login Attempt");
        setIsLoading(false);
      } else {
        const session = await getSession();
        const user = session.user;
        const accessToken = session.accessToken;
        const refreshToken = session.refreshToken;
        const decoded = jwtDecode(accessToken);
        const userRole = decoded.role;
        const userId = session.userId;
        if (session) {
          if (userRole === "admin") {
            toast.success("Login Successfull!");
            router.push("/dashboard");
            setIsLoading(false);
          } else if (userRole === "user") {
            router.push(`/user-issues/${userId}`);
            toast.success("Login Successfull!");
            setIsLoading(false);
          } else {
            toast.error("Unauthorized");
            setIsLoading(false);
          }
        }
      }
    } catch (error) {
      toast.error("Error Logging In");
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
