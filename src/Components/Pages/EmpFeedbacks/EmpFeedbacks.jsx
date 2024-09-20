import { useState, useEffect } from "react";
import Title from "../../Daxbod/Title";

const EmpFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Dummy data for employee feedbacks
    const dummyFeedbacks = [
      {
        id: 1,
        employeeName: "Alice Johnson",
        feedback: "Great team environment and support from management.",
        date: "2024-09-10",
      },
      {
        id: 2,
        employeeName: "Bob Smith",
        feedback: "I appreciate the opportunities for professional growth.",
        date: "2024-09-12",
      },
      {
        id: 3,
        employeeName: "Charlie Brown",
        feedback: "Work-life balance is excellent here.",
        date: "2024-09-15",
      },
      {
        id: 4,
        employeeName: "Diana Prince",
        feedback: "I love the collaborative culture and innovative projects.",
        date: "2024-09-18",
      },
    ];

    setFeedbacks(dummyFeedbacks);
  }, []);

  const handleResponse = (employeeName) => {
    alert(`Responding to feedback from ${employeeName}`);
    // Here you can add your logic for responding, such as opening a modal
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 min-h-[100vh] p-4 sm:ml-64 flex flex-col gap-5 mt-14">
      <Title>Employee Feedbacks</Title>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 border border-gray-300 dark:border-gray-700 transition-transform transform hover:scale-100"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {feedback.employeeName}
              </h2>
              <p className="text-gray-700 dark:text-gray-400 mb-4 italic">
                "{feedback.feedback}"
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="font-medium">Date:</span> {feedback.date}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => handleResponse(feedback.employeeName)}
                  className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 transition"
                >
                  Respond
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-700 dark:text-gray-400">
            No feedbacks found.
          </p>
        )}
      </div>
    </div>
  );
};

export default EmpFeedbacks;
