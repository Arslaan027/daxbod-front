import { useState } from "react";
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
  { name: "Applied", color: "bg-gray-500" },
  { name: "First Call", color: "bg-gray-500" },
  { name: "Interview Scheduled", color: "bg-gray-500" },
  { name: "Interviewed", color: "bg-gray-500" },
  { name: "Selected", color: "bg-gray-500" },
  { name: "Rejected", color: "bg-gray-500 text-red-500" }, // Separate classes properly
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
    <div className="bg-gray-100 dark:bg-gray-800 min-h-[100vh] p-4 sm:ml-64 flex flex-col gap-5 mt-14">
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
                className="bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                onClick={() => openDetailsModal(app)}
              >
                Details
              </button>
            </div>
            {/* Horizontal Timeline Component */}
            <div className="relative flex flex-col items-center w-full max-w-xl mx-auto px-4 py-8">
              {/* Horizontal line */}
              <div
                className="absolute top-1/2 h-1 bg-gray-200 dark:bg-gray-700 z-0"
                style={{ transform: "translateY(-50%)" }}
              />

              {/* Steps */}
              <ul className="flex justify-between w-full relative z-10">
                {statusSteps.map((step, index) => (
                  <li
                    key={index}
                    className="relative flex flex-col items-center cursor-pointer group"
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
                    {/* Step Circle */}
                    <div
                      className={`flex-shrink-0 w-14 h-14 p-10 flex items-center justify-center rounded-full transition-all ${
                        getActiveStep(app.status) === index
                          ? `${step.color} text-white shadow-lg scale-110`
                          : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 scale-100"
                      } duration-300 ease-in-out`}
                    >
                      <span className="text-xs font-semibold">{step.name}</span>
                    </div>

                    {/* Connecting line */}
                    {/* {index < statusSteps.length - 1 && (
                      <div className="absolute top-1/2 right-[-20px] w-full h-1 bg-gray-300 dark:bg-gray-600 z-0"></div>
                    )} */}
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
                className="rounded-xl px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
                onClick={() =>
                  handleStatusChange(modalOpen, "Interview Scheduled")
                }
              >
                Proceed to Interview Scheduled
              </li>
              <li
                className="rounded-xl px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 dark:text-white"
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
                Manager
              </label>
              <select
                value={selectedManager}
                onChange={(e) => setSelectedManager(e.target.value)}
                className="border rounded-lg p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="">Select Manager</option>
                {managers.map((manager, index) => (
                  <option key={index} value={manager}>
                    {manager}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Interview Date
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="border rounded-lg p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div className="mb-4 flex gap-3">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Interview Time
              </label>
              <input
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                className="border rounded-lg p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={handleScheduleInterview}
            >
              Confirm
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              // onClick={handleScheduleInterview}
            ></button>
            <button
              className="ml-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => setScheduleModalOpen(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Interview Feedback */}
      {interviewModalOpen !== null && selectedApplication && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 dark:bg-gray-500 dark:bg-opacity-50 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Interview Feedback
            </h2>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Feedback
            </label>
            <textarea
              value={interviewFeedback}
              onChange={(e) => setInterviewFeedback(e.target.value)}
              className="border rounded-lg p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              rows="4"
            />
            <div className="flex gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-500 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600"
                onClick={handleInterviewCompletion}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setInterviewModalOpen(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Application Details */}
      {detailsModalOpen && selectedApplication && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 dark:bg-gray-500 bg-opacity-50 dark:bg-opacity-50 z-50">
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
