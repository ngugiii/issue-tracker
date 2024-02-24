"use client"
import axios from "axios";
import classNames from "classnames";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Loader from "../components/loader/Loader";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute";

const Page = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredCategory, setFilteredCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 10;

  const filteredIssues =
    filteredCategory === "all"
      ? issues
      : issues.filter((issue) => issue.status.includes(filteredCategory));

  const indexOfLastIssue = currentPage * issuesPerPage;
  const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;
  const currentIssues = filteredIssues.slice(indexOfFirstIssue, indexOfLastIssue);
  const totalIssues = filteredIssues.length;
  const totalPages = Math.ceil(totalIssues / issuesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getIssues = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/issues");
      setIssues(data);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching Issues");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getIssues();
  }, []);

  return (
    <>
      <ProtectedRoute>
        {isLoading && <Loader />}
        <div className="md:px-12 px-2 w-full space-y-6">
          <div className="flex justify-between items-center">
            <select
              name=""
              id=""
              className="border-2 border-gray-700 cursor-pointer p-1 rounded"
              onChange={(e) => setFilteredCategory(e.target.value)}
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
          <div className="w-full flex justify-center items-center">
            <table className="w-full border border-gray-300">
              <thead className="bg-zinc-100 ">
                <tr className="border border-gray-300">
                  <th className="text-center p-2">Issue</th>
                  <th className=" border-gray-200 text-center p-2">Status</th>
                  <th className=" text-center p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {currentIssues.map((issue) => (
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
                          "bg-green-100 text-green-800":
                            issue.status === "CLOSED",
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
          {/* Pagination */}
          <div className="flex justify-center">
            <nav>
              <ul className="flex space-x-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <li key={index} className="cursor-pointer">
                    <button
                      onClick={() => paginate(index + 1)}
                      className={classNames("px-3 bg-gray-200 py-1 rounded", {
                        "bg-gray-700 text-white": currentPage === index + 1,
                      })}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default Page;
