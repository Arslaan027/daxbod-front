import React, { useState } from "react";
import Title from "../../Daxbod/Title";

const initialApplications = [
  {
    id: 1,
    name: "John Doe",
    position: "Software Engineer",
    location: "Aligarh",
    dateApplied: "2024-08-01",
    status: "Under Review",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "Frontend Developer",
    location: "Aligarh",
    dateApplied: "2024-07-20",
    status: "Interview Scheduled",
  },
  {
    id: 3,
    name: "Michael Johnson",
    position: "Backend Developer",
    location: "Aligarh",
    dateApplied: "2024-07-15",
    status: "Rejected",
  },
];

const statusSteps = [
  { name: "Applied", color: "bg-green-800" },
  { name: "First Call", color: "bg-gray-800" },
  { name: "Interview Scheduled", color: "bg-gray-800" },
  { name: "Interviewed", color: "bg-gray-800" },
  { name: "Selected", color: "bg-green-800" },
  { name: "Rejected", color: "bg-red-500" },
];

const managers = [
  "Shehreyar SM Adil",
  "Asad Khan",
  "Saif Afzal",
  "Saud Abdali",
];

const JobApplication = () => {
  const [applications, setApplications] = useState(initialApplications);
  const [modalOpen, setModalOpen] = useState(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(null);
  const [interviewModalOpen, setInterviewModalOpen] = useState(null);
  const [selectedManager, setSelectedManager] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewFeedback, setInterviewFeedback] = useState("");
  const [finalStatus, setFinalStatus] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    setModalOpen(null);
    setScheduleModalOpen(null);
    setInterviewModalOpen(null); // Close the interview modal if open
  };

  const getActiveStep = (status) => {
    if (status === "Rejected") {
      return statusSteps.findIndex((step) => step.name === "Rejected");
    }
    const index = statusSteps.findIndex((step) => step.name === status);
    return index !== -1 ? index : 0;
  };

  const openScheduleModal = (id) => {
    setModalOpen(null);
    setScheduleModalOpen(id);
  };

  const handleScheduleInterview = () => {
    handleStatusChange(scheduleModalOpen, "Interview Scheduled");
    setSelectedManager("");
    setInterviewDate("");
    setInterviewTime("");
  };

  const openDetailsModal = (app) => {
    setSelectedApplication(app);
    setDetailsModalOpen(true);
  };

  const openInterviewModal = (app) => {
    setSelectedApplication(app);
    setInterviewModalOpen(true);
  };

  const handleInterviewCompletion = () => {
    handleStatusChange(selectedApplication.id, finalStatus);
    setInterviewModalOpen(null);
    setSelectedManager("");
    setInterviewDate("");
    setInterviewTime("");
    setInterviewFeedback("");
    setFinalStatus("");
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 min-h-[100vh]  p-4 sm:ml-64 flex flex-col gap-5 mt-14">
      <Title>Job Applications</Title>
      <div className="flex flex-col gap-6">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 border border-gray-300 dark:border-gray-700 relative flex gap-8 items-center"
          >
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {app.name}
              </h2>
              <p className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {app.position}
              </p>
              <p className="text-gray-800 dark:text-gray-300 mb-2">
                {app.location}
              </p>
              <p className="text-gray-700 dark:text-gray-400 mb-4">
                Date Applied: {app.dateApplied}
              </p>

              <button
                className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 flex justify-end items-end"
                onClick={() => openDetailsModal(app)}
              >
                Details
              </button>
            </div>
            {/* Horizontal Timeline Component */}
            <div className="relative flex flex-col items-center w-full max-w-xl overflow-x-auto">
              <div
                className="absolute top-1/2 w-full h-1 bg-gray-300 dark:bg-gray-700 z-0"
                style={{ transform: "translateY(-50%)" }}
              />
              <ul className="flex list-none space-x-8 relative z-10">
                {statusSteps.map((step, index) => (
                  <li
                    key={index}
                    className="relative flex items-center cursor-pointer"
                    onClick={() => {
                      if (step.name === "First Call") {
                        setModalOpen(app.id);
                      } else if (step.name === "Interview Scheduled") {
                        openScheduleModal(app.id);
                      } else if (step.name === "Interviewed") {
                        openInterviewModal(app);
                      } else {
                        handleStatusChange(app.id, step.name);
                      }
                    }}
                  >
                    <div
                      className={`flex-shrink-0 w-14 h-14 flex items-center justify-center ${
                        getActiveStep(app.status) === index
                          ? `${step.color} text-white`
                          : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      } shadow-md z-10 w-auto rounded-full`}
                    >
                      <span className="text-xs px-2 py-1 font-semibold">
                        {step.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for First Call */}
      {modalOpen !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 dark:bg-gray-400 bg-opacity-50 dark:bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              First Call Options
            </h2>
            <ul>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
                onClick={() =>
                  handleStatusChange(modalOpen, "Interview Scheduled")
                }
              >
                Proceed to Interview Scheduled
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-red-100 dark:hover:bg-red-800 dark:text-white"
                onClick={() => handleStatusChange(modalOpen, "Rejected")}
              >
                Reject Application
              </li>
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => setModalOpen(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Scheduling Interview */}
      {scheduleModalOpen !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 dark:bg-gray-500 dark:bg-opacity-50 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Schedule Interview
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Select Manager
              </label>
              <select
                value={selectedManager}
                onChange={(e) => setSelectedManager(e.target.value)}
                className="border rounded-lg p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="" disabled>
                  Select Manager
                </option>
                {managers.map((manager, index) => (
                  <option key={index} value={manager}>
                    {manager}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="border rounded-lg p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Time
              </label>
              <input
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                className="border rounded-lg p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <button
              className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700"
              onClick={handleScheduleInterview}
            >
              Schedule
            </button>
            <button
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => setScheduleModalOpen(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Interview */}
      {interviewModalOpen && selectedApplication && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 dark:bg-gray-500 bg-opacity-50 dark:bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Interview Feedback
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Feedback
              </label>
              <textarea
                value={interviewFeedback}
                onChange={(e) => setInterviewFeedback(e.target.value)}
                rows="4"
                className="border rounded-lg p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700"
                onClick={() => setFinalStatus("Selected")}
              >
                Select
              </button>
              <button
                className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700"
                onClick={() => setFinalStatus("Rejected")}
              >
                Reject
              </button>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={handleInterviewCompletion}
            >
              Confirm
            </button>
            <button
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => setInterviewModalOpen(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Application Details */}
      {detailsModalOpen && selectedApplication && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 dark:bg-gray-500 bg-opacity-50 z-50 dark:bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Application Details
            </h2>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              <strong>Name:</strong> {selectedApplication.name}
            </p>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              <strong>Position:</strong> {selectedApplication.position}
            </p>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              <strong>Location:</strong> {selectedApplication.location}
            </p>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              <strong>Date Applied:</strong> {selectedApplication.dateApplied}
            </p>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              <strong>Status:</strong> {selectedApplication.status}
            </p>
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => setDetailsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplication;
