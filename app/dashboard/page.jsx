"use client";
import React, { useEffect, useRef, useState } from "react";
import BarChart from "../charts/Barchart";
import axios from "axios";
import classNames from "classnames";
import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";

const page = () => {
  const [issues, setIssues] = useState([]);

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

  console.log(issues);

  const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

  const todayIssues = issues.filter((issue) => {
    const issueDate = new Date(issue.createdAt).toISOString().split("T")[0]; // Issue's date in YYYY-MM-DD format
    return issueDate === today; // Filter issues created today
  });

  console.log(todayIssues);

  const groupedIssues = issues.reduce((acc, issue) => {
    const { status } = issue;
    acc[status] = acc[status] ? acc[status] + 1 : 1;
    return acc;
  }, {});

  console.log(groupedIssues);

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
    <div className="px-24 flex w-full">
      <div className="w-full">
        <div className="flex justify-start mb-4">
          {Object.keys(groupedIssues).map((key) => (
            <div
              key={key}
              className="flex border-2 rounded-lg mr-4 p-1 border-gray-400 flex-col justify-center items-center"
            >
              <span className="lowercase">{key} ISSUES</span>{" "}
              <span>{groupedIssues[key]}</span>
            </div>
          ))}
        </div>
        <div className=" p-4 shadow-lg rounded-md">
          <BarChart chartOptions={chartOptions} chartData={chartData} />
        </div>
      </div>
      <div className="ml-8 w-[50%] shadow-lg p-4 rounded-lg">
        <h1 className="text-xl flex items-center mb-2 text-[orangered]">
          Latest Issues
          <span className=" font-normal text-sm text-black ml-1">
            {" "}
            (issues registered today)
          </span>
        </h1>
        {todayIssues.length > 0 ? (
          todayIssues.map((issue) => (
            <div className="mb-3 p-2 border-b flex flex-col">
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
          <div>No Issues Registered Today</div>
        )}
      </div>
    </div>
  );
};

export default page;
