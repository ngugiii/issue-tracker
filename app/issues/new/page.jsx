"use client";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "@/app/components/loader/Loader";
import dynamic from "next/dynamic";
import { useState,useEffect } from "react";
import ProtectedRoute from "@/app/components/protectedRoute/ProtectedRoute";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, control, handleSubmit } = useForm();
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [assignedStatus, setAssignedStatus] = useState("");

  const router = useRouter();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // const getUserDetails = async () => {
  //   setIsLoading(true);
  //   try {
  //     const { data } = await axios.get(`/api/users/${issue.userId}`);
  //     setUserDetails(data);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Error Fetching User Details:", error);
  //     setUserDetails({});
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getUserDetails();
  // }, []);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/issues", data);
      router.push("/issues");
      toast.success("Issue Created");
      setIsLoading(false);
    } catch (error) {
      toast.error("Error Creating Issue");
      setIsLoading(false);
    }
  });
  return (
    <>
      <ProtectedRoute>
        {isLoading && <Loader />}
        <form className="w-full md:p-8 p-3 space-y-3 flex flex-col" onSubmit={onSubmit}>
          <div className="flex md:flex-row flex-col">
          <div className="md:w-[50%] w-full md:mr-8 space-y-3 flex flex-col justify-around">
          <input
            type="text"
            required
            className="border outline-purple-600 rounded p-1"
            placeholder="Title"
            {...register("title")}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <SimpleMDE
                placeholder="Description"
                id=""
                className="border required outline-purple-600 rounded p-1"
                {...field}
              />
            )}
          />

          </div>
          <div className="md:w-[30%] w-full">
          <div className="mb-4">
                <label className="block text-gray-600 font-semibold mb-2">
                  Assign Issue
                </label>
                <select
                {...register("assignedUserId")}                  
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.userName}
                    </option>
                  ))}
                </select>
              </div>
          </div>

          </div>
          <div className="">
          <button className="bg-purple-600 md:w-[20%] hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors">
            Submit New Issue
          </button>

          </div>
        </form>
      </ProtectedRoute>
    </>
  );
};

export default Page;
