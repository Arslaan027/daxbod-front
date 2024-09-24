import { useState, useEffect } from "react";
import Title from "../../Daxbod/Title";

const statusSteps = [
  { name: "Revive", color: "bg-gray-500" },
  { name: "Remove", color: "bg-gray-500" },
];

const HoldApplications = () => {
  const [holdApplications, setHoldApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAppId, setCurrentAppId] = useState(null);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    const fetchHoldApplications = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/hr-management/applicants/hold-app"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch hold applications");
        }
        const data = await response.json();
        setHoldApplications(data);
      } catch (error) {
        console.error("Error fetching hold applications:", error.message);
      }
    };

    fetchHoldApplications();
  }, []);

  const handleStepClick = (appId, stepIndex) => {
    const selectedStep = statusSteps[stepIndex];

    if (selectedStep.name === "Remove") {
      setCurrentAppId(appId);
      setActionType("remove");
      setModalOpen(true);
    } else if (selectedStep.name === "Revive") {
      setCurrentAppId(appId);
      setActionType("revive");
      setModalOpen(true);
    }
  };

  const handleConfirmAction = async () => {
    if (actionType === "remove") {
      try {
        // Call the API to delete the applicant
        const response = await fetch(
          `http://localhost:3000/hr-management/applicants/delete-hold/${currentAppId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete the hold application");
        }

        // Remove the applicant from state
        setHoldApplications((prevApps) =>
          prevApps.filter((app) => app.id !== currentAppId)
        );
      } catch (error) {
        console.error("Error deleting hold application:", error.message);
      }
    } else if (actionType === "revive") {
      const appToUpdate = holdApplications.find(
        (app) => app.id === currentAppId
      );
      if (appToUpdate.status !== "Job Application") {
        setHoldApplications((prevApps) =>
          prevApps.map((app) =>
            app.id === currentAppId
              ? { ...app, status: "Job Application" }
              : app
          )
        );
      }
    }

    // Close the modal and reset states
    setModalOpen(false);
    setCurrentAppId(null);
    setActionType(null);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 min-h-[100vh] p-4 sm:ml-64 flex flex-col gap-5 mt-14">
      <Title>Hold Applications</Title>
      <div className="flex flex-col gap-6">
        {holdApplications.length > 0 ? (
          holdApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 border border-gray-300 dark:border-gray-700 relative flex gap-8 items-center"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {app.fullname}
                </h2>
                <p className="text-lg mb-2 text-gray-900 dark:text-gray-100">
                  Position: {app.positionAppliedFor}
                </p>
                <p className="text-gray-700 dark:text-gray-400 mb-2">
                  Location: {app.location}
                </p>
                <p className="text-gray-700 dark:text-gray-400 mb-4">
                  Date Applied: {app.dateApplied}
                </p>
              </div>
              <div className="relative flex flex-col items-center w-full max-w-xl mx-auto px-4 py-8">
                <div
                  className="absolute top-1/2 h-1 bg-gray-200 dark:bg-gray-700 z-0"
                  style={{ transform: "translateY(-50%)" }}
                />
                <ul className="flex justify-end w-full relative z-10 gap-5">
                  {statusSteps.map((step, index) => (
                    <li
                      key={index}
                      className="relative flex flex-col items-center cursor-pointer group"
                      onClick={() => handleStepClick(app.id, index)}
                    >
                      <div
                        className={`flex-shrink-0 w-14 h-14 p-10 flex items-center justify-center rounded-full transition-all ${
                          app.status === step.name
                            ? `${step.color} text-white shadow-lg scale-110`
                            : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 scale-100"
                        } duration-300 ease-in-out`}
                      >
                        <span className="text-xs font-semibold">
                          {step.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-700 dark:text-gray-400">
            No hold applications found.
          </p>
        )}
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">
              {actionType === "remove" ? "Confirm Removal" : "Confirm Revive"}
            </h2>
            <p>
              {actionType === "remove"
                ? "Are you really sure you want to remove this candidate from the database?"
                : "Do you want to add this candidate back to the job application window?"}
            </p>
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 mr-2"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-gray-500 text-white rounded-md px-4 py-2"
                onClick={handleConfirmAction}
              >
                {actionType === "remove" ? "Remove" : "Revive"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoldApplications;
