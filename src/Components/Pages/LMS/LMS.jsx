import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Title from "../../Daxbod/Title";
import logo from "../../../Images/newlogo.png";

const LMS = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    // id: "",
    empId: "",
    name: "",
    start_date: "",
    end_date: "",
    reason: "",
    paystatus: "",
    leave_type: "",
  });

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/hr-management/leave/pending-app"
      );
      if (!response.ok) {
        throw new Eroor("Failed to fetch pending leave requests");
      }
      const result = await response.json();
      console.log(result);
      setLeaveRequests(result.applications);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     fetchPendingRequests();
  //   }, 1000);
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting request:", newRequest);

    try {
      const response = await fetch(
        "http://localhost:3000/hr-management/leave/submit-app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRequest),
        }
      );
      console.log(response);

      if (!response.ok) {
        return console.error("Failed to submit leave application.");
      }
      const result = await response.json();
      console.log("Leave application submitted:", result);

      setLeaveRequests([...leaveRequests, newRequest]);
      setNewRequest({
        // id: "",
        empId: "",
        name: "",
        start_date: "",
        end_date: "",
        reason: "",
        paystatus: "",
        leave_type: "",
      });
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };

  const handleUpdateStatus = async (request, status) => {
    console.log("Updating leave status for ID:", request, "to status:", status);
    try {
      const response = await fetch(
        `http://localhost:3000/hr-management/leave/update-app?id=${request.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Corrected here
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update leave status");
      }
      const result = await response.json();
      console.log("Leave status updated:", result);

      fetchPendingRequests();
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  return (
    <div className="flex md:ml-60 mt-7 items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
        {/* Left Section: Leave Request Form */}
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-t-lg md:rounded-l-lg shadow-lg md:w-1/2">
          <div className="flex gap-2 items-start">
            <img src={logo} className="h-7 flex " />
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 ">
              Request Leave
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="empId"
                className="block text-gray-700 dark:text-gray-300"
              >
                Employee ID
              </label>
              <input
                id="empId"
                name="empId"
                type="text"
                value={newRequest.empId}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
                required
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={newRequest.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
                // required
              />
            </div>
            <div>
              <label
                htmlFor="start_date"
                className="block text-gray-700 dark:text-gray-300"
              >
                Start Date
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={newRequest.start_date}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
                // required
              />
            </div>
            <div>
              <label
                htmlFor="end_date"
                className="block text-gray-700 dark:text-gray-300"
              >
                End Date
              </label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                value={newRequest.end_date}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
                // required
              />
            </div>
            <div>
              <label
                htmlFor="reason"
                className="block text-gray-700 dark:text-gray-300"
              >
                Reason
              </label>
              <textarea
                id="reason"
                name="reason"
                value={newRequest.reason}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
                rows="4"
                // required
              />
            </div>
            <div>
              <label
                htmlFor="payStatus"
                className="block text-gray-700 dark:text-gray-300"
              >
                Pay Status
              </label>
              <select
                id="paystatus"
                name="paystatus"
                value={newRequest.paystatus}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
                // required
              >
                <option value="Select">Select</option>

                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="leaveType"
                className="block text-gray-700 dark:text-gray-300"
              >
                Leave Type
              </label>
              <select
                id="leave_type"
                name="leave_type"
                value={newRequest.leave_type}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
                // required
              >
                <option value="Select">Select</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Earned Leave">Earned Leave</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* Right Section: Leave Requests List */}
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-b-lg md:rounded-r-lg shadow-lg md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 ">
            Leave Requests
          </h2>
          {console.log(leaveRequests)}
          {leaveRequests.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No leave requests found.
            </p>
          ) : (
            <ul className="space-y-4">
              {leaveRequests.map((request) => (
                <li
                  key={request.id}
                  className="border border-gray-300 rounded-lg p-4 dark:border-gray-600 dark:bg-gray-800"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 ">
                    {request.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Emp ID: {request.empId}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start Date: {request.start_date}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    End Date: {request.end_date}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Reason: {request.reason}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Pay Status: {request.paystatus}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Leave Type: {request.leave_type}
                  </p>

                  {/* Display status: Approved, Declined or Pending */}
                  {request.status === "Approved" ? (
                    <div className="flex items-center">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      <span className="text-green-500">Approved</span>
                    </div>
                  ) : request.status === "Declined" ? (
                    <div className="flex items-center">
                      <FaTimesCircle className="text-red-500 mr-2" />
                      <span className="text-red-500">Declined</span>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(request, "Approved")}
                        className="bg-green-500 text-white py-1 px-2 rounded-lg hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(request, "Declined")}
                        className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LMS;
