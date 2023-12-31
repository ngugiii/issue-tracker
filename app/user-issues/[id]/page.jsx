"use client";
import axios from "axios";
import classNames from "classnames";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";
import ConfirmPopup from "@/app/components/confirmPopup/ConfirmPopup";
import Loader from "@/app/components/loader/Loader";

const Page = () => {
  const [userIssues, setUserIssues] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedIssueStatus, setEditedIssueStatus] = useState("");
  const [editedAssignedStatus, setEditedAssignedStatus] = useState("");
  const [selectedIssueId, setSelectedIssueId] = useState("");
  const [popupState, setPopupState] = useState({});
  const [filteredCategory, setFilteredCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredIssues =
    filteredCategory === "all"
      ? userIssues
      : userIssues.filter((issue) => issue.status.includes(filteredCategory));

  const params = useParams();
  const userId = params.id;
  const getIssues = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/user-issues/${userId}`);
      setUserIssues(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error Loading Issues");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getIssues();
  }, []);
  const handleEditStatus = (IssueId, issue) => {
    setSelectedIssueId(IssueId);
    setEditedIssueStatus(issue.status);
    setEditedAssignedStatus(issue.userId);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setEditedIssueStatus("");
    setEditedAssignedStatus("");
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const updateObject = {
        status: editedIssueStatus,
        assignedUserId: editedAssignedStatus,
      };
      console.log(updateObject);

      await axios.put(`/api/issues/${selectedIssueId}`, updateObject);

      getIssues();
      handleModalClose();
      toast.success("Statuses updated successfully.");
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to update statuses.");
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {filteredIssues && filteredIssues.length > 0 ? (
        <div className="w-full md:px-10 px-3 py-2">
          <div className="flex justify-start items-center mb-2">
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
          </div>
          <div className="w-full overflow-x-scroll">
            <table className="w-full border border-gray-300">
              <thead className="bg-zinc-100 ">
                <tr className="border border-gray-300">
                  <th className="text-center p-2">Issue</th>
                  <th className=" border-gray-200 text-center p-2">Status</th>
                  <th className=" text-center p-2">Created</th>
                  <th className=" text-center p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues &&
                  filteredIssues.map((issue) => (
                    <tr key={issue.id} className="">
                      <td className="border-b underline text-blue-500 cursor-pointer hover:text-blue-600 border-gray-200 rounded text-center p-2">
                        {issue.title}
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
                      <td className="border-b border-gray-200 rounded text-center flex justify-center items-center p-2">
                        <div
                          className="bg-red-500 hover:bg-red-600 text-white p-2 cursor-pointer rounded-md"
                          onClick={() => handleEditStatus(issue.id, issue)}
                        >
                          <FiEdit size={20} />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* <div className="issue-left space-y-4  w-[70%]">
                  {userIssues &&
                    userIssues.map((issue) => (
                      <div className="border-2 rounded-md p-4">
                        <h1 className="text-2xl font-semibold font-serif">
                          {issue.title}
                        </h1>
                        <div className="space-x-4">
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
                          <span>
                            {" "}
                            {format(issue.createdAt, " h:mm a, MMMM d, yyyy")}
                          </span>
                        </div>
                        <div className="mt-4 text-lg">{issue.description}</div>
                      </div>
                    ))}
                </div> */}
          {/* <div className="issue-right space-y-5 flex flex-col justify-center items-center w-[30%]">
                  {issue && issue.userId && userDetails && userDetails.userName && (
                    <span className="border-2 rounded p-2">
                      Assigned to{" "}
                      <span className="text-[orangered] font-semibold">
                        {userDetails.userName}
                      </span>
                    </span>
                  )}
                  {issue && !issue.userId && (
                    <span className="p-2 border-2 border-gray-400 rounded-md">
                      Not yet assigned
                    </span>
                  )}
                  {i && (
                    <button
                      className="flex justify-center items-center text-white rounded-md px-2 py-1 cursor-pointer bg-[#eb6e41] hover:bg-[orangered] w-[50%]"
                      onClick={() => handleEditStatus(issue?.id)}
                    >
                      <FiEdit className="mr-2" />
                      Edit Issue
                    </button>
                  )}{" "}
                </div> */}
        </div>
      ) : (
        // Render this content when there are no userIssues
        <div className="full md:px-10 px-2 text-center text-red-600 text-2xl py-2">
          <p className="text-center">
            No issues have been assigned to you yet.
          </p>
        </div>
      )}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white md:w-[40%] p-12 rounded-md">
            <h3 className="text-lg font-semibold mb-4 text-[orangered]">
              Edit Statuses
            </h3>
            <div className="mb-4">
              <label className="block text-gray-600 font-semibold mb-2">
                Issue Status
              </label>
              <select
                value={editedIssueStatus}
                onChange={(e) => setEditedIssueStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">Select Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            {/* <div className="mb-4">
                  <label className="block text-gray-600 font-semibold mb-2">
                    Assign Issue
                  </label>
                  <select
                    value={editedAssignedStatus}
                    onChange={(e) => setEditedAssignedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.userName}
                      </option>
                    ))}
                  </select>
                </div> */}
            <div className="flex justify-end">
              <button onClick={handleModalClose} className="mr-2">
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
