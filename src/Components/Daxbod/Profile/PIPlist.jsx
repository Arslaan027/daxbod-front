import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Title from "../Title";
import { IoMdPersonAdd } from "react-icons/io";

const PIPlist = ({ darkMode }) => {
  const [showForm, setShowForm] = useState(false);
  const [employee, setEmployee] = useState({
    empId: "",
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
  });
  const [dataFromDb, setDataFromDb] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/hr-management/PIP/get-pip"
        );
        // console.log("API Response:", res.data[0]);

        // Extract PIP entries from the response
        if (
          Array.isArray(res.data) &&
          res.data.length > 0 &&
          Array.isArray(res.data[0])
        ) {
          setEmployees(res.data[0]); // Set employees with the first sub-array
        } else {
          throw new Error("API response is not in the expected format.");
        }
      } catch (err) {
        console.error(`Error fetching data: ${err}`);
        setError("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post(
          "http://localhost:3000/hr-management/PIP/add-pip",
          employee
        );
        // console.log("Submitted Data:", res.data); // Log the submitted data
        setDataFromDb((prev) => [...prev, res.data]);
        resetForm();
      } catch (error) {
        console.error("Error submitting employee data:", error);
        setError("Failed to submit data. Please try again.");
      }
    },
    [employee]
  );

  const resetForm = () => {
    setEmployee({
      empId: "",
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "",
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full max-h-[100vh] overflow-y-hidden mx-auto">
      <div className="flex justify-between items-center">
        <Title>PIP Employees</Title>
        <button
          className="text-gray-500 py-2 px-4 rounded-full flex items-center justify-center"
          onClick={() => setShowForm(!showForm)}
        >
          <IoMdPersonAdd className="text-2xl" />
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-200 p-4 rounded-lg mb-4"
        >
          <div className="mb-2">
            <label htmlFor="empId" className="block mb-1">
              Employee ID
            </label>
            <input
              type="text"
              name="empId"
              value={employee.empId}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="description" className="block mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={employee.description}
              onChange={handleChange}
              className="p-2 text-black border rounded w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="startDate" className="block mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={employee.startDate}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="endDate" className="block mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={employee.endDate}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="status" className="block mb-1">
              Status
            </label>
            <input
              type="text"
              name="status"
              value={employee.status}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="p-2 bg-green-500 text-white rounded-lg w-full"
          >
            Submit
          </button>
        </form>
      )}

      {employees.length > 0 && (
        <div className="mt-4 overflow-y-auto max-h-screen">
          <div className="w-full min-w-max">
            {employees.map((emp, index) => (
              <div
                key={emp.id || index}
                className={`bg-white rounded-lg p-4 shadow-lg mb-4 ${
                  darkMode ? "dark:text-gray-100 dark:bg-gray-900" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                  {emp.name} {/* Display Employee Name */}
                </h3>
                <p className="text-gray-600 dark:text-gray-100">
                  {/* {emp.description} */}
                </p>
                <p className="text-gray-600 dark:text-gray-100">
                  {/* Start Date: {new Date(emp.startDate).toLocaleDateString()} */}
                </p>
                <p className="text-gray-600 dark:text-gray-100">
                  End Date: {new Date(emp.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 dark:text-gray-100">
                  Status: {emp.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {dataFromDb.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">PIP Entries from DB:</h2>
          {dataFromDb.map((pip, idx) => (
            <div
              key={idx}
              className="bg-gray-100 p-2 rounded-lg shadow mt-2 dark:bg-gray-800"
            >
              <p>Employee ID: {pip.empId}</p>
              <p>Description: {pip.description}</p>
              <p>Start Date: {new Date(pip.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(pip.endDate).toLocaleDateString()}</p>
              <p>Status: {pip.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PIPlist;
