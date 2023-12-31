"use client";
import React, { useEffect, useRef, useState } from "react";
import BarChart from "../charts/Barchart";
import axios from "axios";
import classNames from "classnames";
import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";
import Loader from "../components/loader/Loader";

const Page = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getIssues = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/issues");
      setIssues(data);
    setIsLoading(false)
    } catch (error) {
      console.log("Error fetching Issues");
    setIsLoading(false)
    }
  };

  useEffect(() => {
    getIssues();
  }, []);

  const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

  const todayIssues = issues.filter((issue) => {
    const issueDate = new Date(issue.createdAt).toISOString().split("T")[0]; // Issue's date in YYYY-MM-DD format
    return issueDate === today; // Filter issues created today
  });

  const groupedIssues = issues.reduce((acc, issue) => {
    const { status } = issue;
    acc[status] = acc[status] ? acc[status] + 1 : 1;
    return acc;
  }, {});

  const chartRef = useRef(null);
  const chartData = {
    labels: Object.keys(groupedIssues),
    datasets: [
      {
        label: "Issues",
        data: Object.values(groupedIssues),
        backgroundColor: ["#FF6347", "#32CD32", "#FFD700"],
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Issue Status",
      },
      legend: {
        display: false,
      },
      datalabels: {
        color: "#ffffff",
        anchor: "end",
        align: "start",
        offset: -10,
        font: {
          weight: "bold",
          size: "10",
        },
        formatter: (value) => value || "",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };
  return (
    <>
    {isLoading && <Loader/>}
        <div className="md:px-24 px-4 flex md:flex-row flex-col w-full">
      <div className="w-full">
        <div className="flex md:justify-start justify-center mb-4">
          {Object.keys(groupedIssues).map((key) => (
            <div
              key={key}
              className="flex border-2 rounded-lg mr-4 p-1 text-center border-gray-400 flex-col justify-center items-center"
            >
              <span className="lowercase">{key} ISSUES</span>{" "}
              <span>{groupedIssues[key]}</span>
            </div>
          ))}
        </div>
        <div className="p-4 shadow-lg rounded-md">
          <BarChart chartOptions={chartOptions} chartData={chartData} />
        </div>
      </div>
      <div className="md:ml-8 md:mt-0 mt-12 md:w-[50%] w-full shadow-lg p-4 rounded-lg">
        <h1 className="md:text-xl md:font-semibold flex items-center mb-2 text-[orangered]">
          Latest Issues
          <span className=" font-normal text-sm text-black ml-1">
            {" "}
            (issues registered today)
          </span>
        </h1>
        {todayIssues.length > 0 ? (
          todayIssues.map((issue) => (
            <div key={issue.id} className="mb-3 p-2 border-b flex flex-col">
                <Link href={`issues/${issue.id}`} className=" hover:text-blue-700 hover:underline">
            {issue.title}
              </Link>
              <span
                className={classNames({
                  "bg-red-100 text-red-600": issue.status === "OPEN",
                  "bg-purple-100 text-purple-800":
                    issue.status === "IN_PROGRESS",
                  "bg-green-100 text-green-800": issue.status === "CLOSED",
                  "p-1 rounded text-center w-[30%] mb-2 lowercase": true,
                })}
              >
                {issue.status}
              </span>
            </div>
          ))
        ) : (
          <div className="w-full flex justify-center items-center">No Issues Registered Today</div>
        )}
      </div>
    </div>
    </>
  );
};

export default Page;
