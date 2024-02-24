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
import ProtectedRoute from "@/app/components/protectedRoute/ProtectedRoute";

const Page = () => {
  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const id = params._id;
  const router = useRouter();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedIssueStatus, setEditedIssueStatus] = useState("");
  const [editedAssignedStatus, setEditedAssignedStatus] = useState("");
  const [selectedIssueId, setSelectedIssueId] = useState("");
  const [popupState, setPopupState] = useState({});
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

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

  const togglePopup = (sessionId) => {
    setPopupState((prevState) => ({
      ...prevState,
      [sessionId]: !prevState[sessionId] || false,
    }));
  };

  const getIssueDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/issues/${id}`);
      setIssue(data);
      setEditedIssueStatus(data.status);
      setEditedAssignedStatus(data.userId || "");
      setIsLoading(false);
    } catch (error) {
      // toast.error("Error Fetching Issues");
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getIssueDetails();
  }, []);

  const getUserDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/users/${issue.userId}`);
      setUserDetails(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error Fetching User Details:", error);
      setUserDetails({});
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [issue]);
  const handleEditStatus = (IssueId) => {
    setSelectedIssueId(IssueId);
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
      if (!issue) {
        toast.error("Issue details not available.");
        return;
      }

      const updateObject = {
        status: editedIssueStatus || issue.status,
        assignedUserId: editedAssignedStatus || issue.assigned,
      };
      console.log(updateObject);

      await axios.put(`/api/issues/${id}`, updateObject);
      const { data } = await axios.get(`/api/issues/${id}`);
      setIssue(data);
      handleModalClose();
      toast.success("Statuses updated successfully.");
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to update statuses.");
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (issueId) => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/issues/${issueId}`);
      toast.success("Issue deleted successfully.");
      router.push("/issues");
      setIsLoading(false);
      getIssueDetails();
    } catch (error) {
      toast.error("Failed to delete Issue.");
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <ProtectedRoute>
        <div className="full md:p-10 p-4 flex md:flex-row flex-col">
          <div className="issue-left md:space-y-4  md:w-[70%] w-full">
            {issue && (
              <h1 className="text-2xl md:mb-0 mb-2 md:text-left text-center font-semibold font-serif">
                {issue.title}
              </h1>
            )}
            {issue && (
              <div className="space-x-4 flex md:flex-row items-center flex-col">
                <span
                  className={classNames({
                    "bg-red-100 text-red-600": issue.status === "OPEN",
                    "bg-purple-100 text-purple-800":
                      issue.status === "IN_PROGRESS",
                    "bg-green-100 text-green-800": issue.status === "CLOSED",
                    "p-1 rounded md:mb-0 mb-2 lowercase": true,
                  })}
                >
                  {issue.status}
                </span>
                <span> {format(issue.createdAt, " h:mm a, MMMM d, yyyy")}</span>
              </div>
            )}
            {issue && (
              <div className="border-2 md:mt-0 mt-4 rounded-md p-4">
                {issue.description}
              </div>
            )}
          </div>
          <div className="issue-right space-y-5 flex flex-col justify-center items-center md:w-[30%] md:mt-0 mt-8">
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
            {issue && (
              <button
                className="flex justify-center items-center text-white rounded-md px-2 py-1 cursor-pointer bg-[#eb6e41] hover:bg-[orangered] w-[50%]"
                onClick={() => handleEditStatus(issue?.id)}
              >
                <FiEdit className="mr-2" />
                Edit Issue
              </button>
            )}{" "}
            {issue && (
              <button
                className=" text-white rounded-md px-2 py-1 cursor-pointer bg-red-500 hover:bg-red-600 w-[50%]"
                onClick={() => togglePopup(issue?.id)}
              >
                Delete Issue
              </button>
            )}
            {popupState[issue?.id || ""] && (
              <ConfirmPopup
                title="Delete Issue"
                description={`Permanently delete this Issue? You can't undo this`}
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                onConfirm={() => handleDelete(issue?.id || "")}
                onCancel={() => togglePopup(issue?.id || "")}
              />
            )}
          </div>
        </div>
        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white md:w-[40%] w-[80%] p-12 rounded-md">
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
              <div className="mb-4">
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
              </div>
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
      </ProtectedRoute>
    </>
  );
};

export default Page;
