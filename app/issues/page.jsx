"use client";
import axios from "axios";
import classNames from "classnames";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";

const page = () => {
  const [issues, setIssues] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("all");

  const filteredIssues= filteredCategory === "all" ? issues : issues.filter((issue)=>issue.status.includes(filteredCategory));

  const getIssues = async () => {
    try {
      const { data } = await axios.get("/api/issues");
      setIssues(data);
    } catch (error) {
      console.log("Error fetching Issues");
    }
  };

  useEffect(() => {
    getIssues();
  }, []);


  return (
    <>
        <div className="md:px-12 px-2 w-full space-y-6">
      <div className="flex justify-between items-center">
        <select name="" id="" className="border-2 border-gray-700 cursor-pointer p-1 rounded" onChange={(e) => setFilteredCategory(e.target.value)}
>
          <option value="all">All</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors">
          <Link href="/issues/new">New Issue</Link>
        </button>
      </div>
      <div className="w-full">
        <table className="w-full border border-gray-300">
          <thead className="bg-zinc-100 ">
            <tr className="border border-gray-300">
              <th className="text-center p-2">Issue</th>
              <th className=" border-gray-200 text-center p-2">Status</th>
              <th className=" text-center p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue.id} className="">
                <td className="border-b underline text-blue-500 cursor-pointer hover:text-blue-600 border-gray-200 rounded text-center p-2">
                  <Link href={`issues/${issue.id}`}>{issue.title}</Link>
                </td>
                <td className="border-b border-gray-200 rounded text-center p-2 lowercase">
                  <span
                    className={classNames({
                      "bg-red-100 text-red-600": issue.status === "OPEN",
                      "bg-purple-100 text-purple-800":
                        issue.status === "IN_PROGRESS",
                      "bg-green-100 text-green-800": issue.status === "CLOSED",
                      "p-1 rounded lowercase": true,
                    })}
                  >
                    {issue.status}
                  </span>
                </td>
                <td className="border-b border-gray-200 rounded text-center p-2">
                  {format(issue.createdAt, " h:mm a, MMMM d, yyyy")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
    </>

  );
};

export default page;
