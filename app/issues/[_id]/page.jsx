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

const page = () => {
  const [issue, setIssue] = useState(null);
  const params = useParams();
  const id = params._id;
  const router = useRouter();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedIssueStatus, setEditedIssueStatus] = useState("");
  const [editedAssignedStatus, setEditedAssignedStatus] = useState("");
  const [selectedIssueId, setSelectedIssueId] = useState("");
  const [popupState, setPopupState] = useState({});

  const togglePopup = (sessionId) => {
    setPopupState((prevState) => ({
      ...prevState,
      [sessionId]: !prevState[sessionId] || false,
    }));
  };

  const getIssueDetails = async () => {
    try {
      const { data }= await axios.get(
        `/api/issues/${id}`
      );
      setIssue(data);
    } catch (error) {
      // toast.error("Error Fetching Issues");
      console.log(error);
      
    }
  };

  useEffect(() => {
    getIssueDetails();
  }, []);

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
    try {
      if (!issue) {
        toast.error("Issue details not available.");
        return;
      }

      const updateObject = {
        status: editedIssueStatus || issue.status,
        // assigned: editedAssignedStatus || issue.assigned,
      };
      console.log(updateObject);

      await axios.put(`/api/issues/${id}`, updateObject);

      const { data }= await axios.get(
        `/api/issues/${id}`
      );
      setIssue(data);
      handleModalClose();
      toast.success("Statuses updated successfully.");
    } catch (error) {
      toast.error("Failed to update statuses.");
      console.error(error);
    }
  };

  const handleDelete = async (issueId) => {
    try {
      await axios.delete(`/api/issues/${issueId}`);
      toast.success("Issue deleted successfully.");
      router.push("/issues")
      getIssueDetails();
    } catch (error) {
      toast.error("Failed to delete Issue.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="full p-10 flex">
        <div className="issue-left space-y-4  w-[70%]">
          {issue && (
            <h1 className="text-2xl font-semibold font-serif">{issue.title}</h1>
          )}
          {issue && (
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
              <span> {format(issue.createdAt, " h:mm a, MMMM d, yyyy")}</span>
            </div>
          )}
          {issue && (
            <div className="border-2 rounded-md p-4">{issue.description}</div>
          )}
        </div>
        <div className="issue-right space-y-5 flex flex-col justify-center items-center w-[30%]">
          <select name="" id="" className="border rounded w-[50%] p-2">
            <option value="unassigned">Unassigned</option>
            <option value="assigned">Assigned</option>
          </select>
          {issue && (
            <button
              className="flex justify-center items-center text-white rounded-md px-2 py-1 cursor-pointer bg-[#eb6e41] hover:bg-[orangered] w-[50%]"
              onClick={() => handleEditStatus(issue?.id)}
            >
              <FiEdit className="mr-2" />
              Edit Issue
            </button>
          )}{" "}
        {issue && (<button className=" text-white rounded-md px-2 py-1 cursor-pointer bg-red-500 hover:bg-red-600 w-[50%]" onClick={()=>togglePopup(issue?.id)}>
            Delete Issue
          </button>)}  
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
          <div className="bg-white p-12 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Edit Statuses</h3>
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
                Assigned Status
              </label>
              <select
                value={editedAssignedStatus}
                onChange={(e) => setEditedAssignedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                {/* Add delivery status options as needed */}
                <option value="">Select Status</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
                {/* <option value="Processing">Processing</option> */}
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
    </>
  );
};

export default page;
