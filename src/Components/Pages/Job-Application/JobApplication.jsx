import { useState, useEffect } from "react";
import Title from "../../Daxbod/Title";
import { useNavigate } from "react-router-dom";

// Mock data and other constants
const initialApplications = [];

const statusSteps = [
  { name: "Applied", color: "bg-gray-500" },
  { name: "First Call", color: "bg-gray-500" },
  { name: "Interview Scheduled", color: "bg-gray-500" },
  { name: "Interviewed", color: "bg-gray-500" },
  { name: "Selected", color: "bg-gray-500" },
  { name: "Rejected", color: "bg-gray-500 text-red-500" },
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
  const [rejectedModalOpen, setRejectedModalOpen] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/hr-management/applicants/get-app",
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    fetchApplications();
  }, []);
  const formatDate = (dateString) => {
    if (!dateString || dateString === "0000-00-00") return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const updateApplicationStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/hr-management/applicants/update-status/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteApplication = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/hr-management/applicants/delete-app/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete application.");
      }

      const data = await response.json();
      console.log(data.message);

      setApplications((prevApps) => prevApps.filter((app) => app.id !== id));
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);

      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Failed to change status:", error);
    }
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
    setScheduleModalOpen(null);
  };

  const openDetailsModal = (app) => {
    setSelectedApplication(app);
    setDetailsModalOpen(true);
  };

  const openInterviewModal = (app) => {
    setSelectedApplication(app);
    setInterviewModalOpen(true);
  };

  const openRejectedModal = (app) => {
    setSelectedApplication(app);
    setRejectedModalOpen(true);
  };

  const handleFirstCallResponse = (id, confirmed) => {
    if (confirmed) {
      handleStatusChange(id, "First Call");
    }
    setModalOpen(null);
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

  const handleRejectedAction = async (action) => {
    if (action === "Hold") {
      await handleStatusChange(selectedApplication.id, "On Hold");
    } else if (action === "Remove") {
      await deleteApplication(selectedApplication.id);
    }
    setRejectedModalOpen(null);
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
                {app.fullname}
              </h2>
              <p className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {app.positionAppliedFor}
              </p>
              <p className="text-gray-800 dark:text-gray-300 mb-2">
                {app.location}
              </p>
              <p className="text-gray-700 dark:text-gray-400 mb-4">
                Date Applied: {formatDate(app.dateApplied || "0000-00-00")}
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
                      } else if (step.name === "Selected") {
                        navigate("/selected");
                      } else if (step.name === "Rejected") {
                        openRejectedModal(app);
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
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* First Call Modal */}
      {modalOpen !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setModalOpen(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Schedule First Call</h2>
            <p>Would you like to schedule the first call?</p>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => handleFirstCallResponse(modalOpen, true)}
              >
                Yes
              </button>
              <button
                className="bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => handleFirstCallResponse(modalOpen, false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {scheduleModalOpen !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setScheduleModalOpen(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Schedule Interview</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-2">Manager</label>
                <select
                  className="w-full border border-gray-300 rounded p-2"
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                >
                  <option value="">Select Manager</option>
                  {managers.map((manager) => (
                    <option key={manager} value={manager}>
                      {manager}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded p-2"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2">Time</label>
                <input
                  type="time"
                  className="w-full border border-gray-300 rounded p-2"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                />
              </div>
              <button
                className="bg-gradient-to-r from-green-400 to-gray-600 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={handleScheduleInterview}
              >

                Schedule Interview

              </button>
            </div>


                <option value="">Select Manager</option>
                {managers.map((manager, index) => (
                  <option key={index} value={manager}>
                    {manager}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="block mb-2">Date:</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">Time:</label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
              />
            </div>
            <button
              className="bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4"
              onClick={handleScheduleInterview}
            >
              Schedule Interview
            </button>
          </div>
        </div>
      )}


      {/* Details Modal */}
      {detailsModalOpen && selectedApplication && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setDetailsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Application Details</h2>
            <p>
              <strong>Name:</strong> {selectedApplication.fullname}
            </p>
            <p>
              <strong>Position:</strong>{" "}
              {selectedApplication.positionAppliedFor}
            </p>
            <p>
              <strong>Location:</strong> {selectedApplication.location}
            </p>
            <p>
              <strong>Date Applied:</strong>{" "}
              {formatDate(selectedApplication.dateApplied)}
            </p>
            {/* Add more details as needed */}
            <button
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => setDetailsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}


      {/* Interview Feedback Modal */}

      {interviewModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setInterviewModalOpen(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Interview Feedback</h2>

            <div>
              <label className="block mb-2">Interview Feedback:</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows="4"
                value={interviewFeedback}
                onChange={(e) => setInterviewFeedback(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">Final Status:</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={finalStatus}
                onChange={(e) => setFinalStatus(e.target.value)}

              >
                <option value="">Select Status</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <button
              className="bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4"
              onClick={handleInterviewCompletion}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {/* Rejected Status Modal */}
      {rejectedModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setRejectedModalOpen(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Rejected Status</h2>
            <p>What would you like to do with this application?</p>
            <div className="flex gap-4 mt-4">
              <button

                className="bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-gray-600 text-white px-4 py-2 rounded"

                onClick={() => handleRejectedAction("Hold")}
              >
                Hold
              </button>
              <button

                className="bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-gray-600 text-white px-4 py-2 rounded"

                onClick={() => handleRejectedAction("Remove")}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplication;
