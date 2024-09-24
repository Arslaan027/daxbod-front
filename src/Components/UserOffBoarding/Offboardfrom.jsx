import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OffboardForm = ({ onSubmit, darkMode }) => {
  const [newOffboard, setNewOffboard] = useState({
    empId: "",
    name: "",
    designation: "",
    dept: "",
    offboardDate: "",
    exitInterviewNotes: "",
    propertyReturned: false,
    finalPaycheckCleared: false,
    exitInterviewCompleted: false,
    additionalComments: "",
  });

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewOffboard((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newOffboard); // Trigger the submit action with form data
    setNewOffboard({
      empId: "",
      name: "",
      designation: "",
      dept: "",
      offboardDate: "",
      exitInterviewNotes: "",
      propertyReturned: false,
      finalPaycheckCleared: false,
      exitInterviewCompleted: false,
      additionalComments: "",
    }); // Reset form after submission
  };

  return (
    <div
      className={`p-4 min-w-full mt-24 flex flex-col md:pl-72 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <style>
        {`
          @keyframes blink {
            0%, 100% {
              color: black;
            }
            50% {
              color: #f56565; /* Tailwind's red-500 */
            }
          }

          .blinking {
            animation: blink 1s infinite;
          }
        `}
      </style>

      <h1 className="text-2xl font-bold mb-4 text-red-500">
        Off-Board Employee
      </h1>
      <p className="mb-4 text-md blinking">
        Please fill in all required fields. Ensure that company property is
        returned and exit interview notes are documented.
      </p>
      <form onSubmit={handleSubmit}>
        {/* Employee ID Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="empId">
            Employee ID
          </label>
          <input
            type="text"
            id="empId"
            name="empId"
            value={newOffboard.empId}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newOffboard.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        {/* Designation Input */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="designation"
          >
            Designation
          </label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={newOffboard.designation}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        {/* Department Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="dept">
            Department
          </label>
          <input
            type="text"
            id="dept"
            name="dept"
            value={newOffboard.dept}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        {/* Offboarding Date Input */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="offboardDate"
          >
            Offboarding Date
          </label>
          <input
            type="date"
            id="offboardDate"
            name="offboardDate"
            value={newOffboard.offboardDate}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        {/* Exit Interview Notes Input */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="exitInterviewNotes"
          >
            Exit Interview Notes
          </label>
          <textarea
            id="exitInterviewNotes"
            name="exitInterviewNotes"
            value={newOffboard.exitInterviewNotes}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            rows={3}
            placeholder="Document any relevant notes from the exit interview..."
          />
        </div>

        {/* Checkboxes */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="propertyReturned"
            name="propertyReturned"
            checked={newOffboard.propertyReturned}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="propertyReturned" className="text-sm">
            Company Property Returned
          </label>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="finalPaycheckCleared"
            name="finalPaycheckCleared"
            checked={newOffboard.finalPaycheckCleared}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="finalPaycheckCleared" className="text-sm">
            Final Paycheck Cleared
          </label>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="exitInterviewCompleted"
            name="exitInterviewCompleted"
            checked={newOffboard.exitInterviewCompleted}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="exitInterviewCompleted" className="text-sm">
            Exit Interview Completed
          </label>
        </div>

        {/* Additional Comments Input */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="additionalComments"
          >
            Additional Comments
          </label>
          <textarea
            id="additionalComments"
            name="additionalComments"
            value={newOffboard.additionalComments}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            rows={3}
            placeholder="Any other comments or notes..."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={goBack}
            className="bg-gray-300 text-gray-800 rounded-lg py-2 px-4 hover:bg-gray-400"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-red-500 text-white rounded-lg py-2 px-4 hover:bg-red-600"
          >
            Request Approval
          </button>
        </div>
      </form>
    </div>
  );
};

export default OffboardForm;
