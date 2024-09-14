// FeedbackSupport.jsx
import { useState } from "react";

const FeedbackSupport = () => {
  const [feedback, setFeedback] = useState("");
  const [requests, setRequests] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submitting feedback
    setRequests([
      ...requests,
      { id: requests.length + 1, feedback, status: "Pending" },
    ]);
    setFeedback("");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Feedback and Support</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows="4"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback or support request here"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Your Requests</h3>
      <ul className="list-disc pl-5">
        {requests.map((request) => (
          <li key={request.id} className="mb-2">
            <div className="font-bold">Request ID: {request.id}</div>
            <p>{request.feedback}</p>
            <span
              className={`inline-block mt-1 px-2 py-1 rounded ${
                request.status === "Pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {request.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackSupport;
