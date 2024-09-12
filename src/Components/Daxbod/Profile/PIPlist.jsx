import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Title from "../Title";
import { IoMdPersonAdd } from "react-icons/io";

const PIPlist = ({ darkMode }) => {
  const [showForm, setShowForm] = useState(false);
  const [employee, setEmployee] = useState({
    empId: "",
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

        if (Array.isArray(res.data[0])) {
          setEmployees(res.data[0]); // Use res.data directly if it’s an array of PIP records
        } else {
          throw new Error("API response is not in the expected format.");
        }
        console.log(res.data[0]);
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
    <div className="flex flex-col gap-4 p-4 w-full max-h-[90vh] overflow-y-auto mx-auto">
      <div className="flex justify-between items-center mb-4">
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
          {/* Form fields */}
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
              className="p-2 border rounded w-full"
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
        <div className="mt-4">
          <h2 className="text-xl font-semibold">PIP Employees:</h2>
          {employees.map((emp, index) => (
            <div
              key={emp.id || index}
              className={`bg-white rounded-lg p-4 shadow-lg ${
                darkMode ? "dark:text-gray-100 dark:bg-gray-900" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                {emp.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-100">{emp.position}</p>
            </div>
          ))}
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
              <p>Start Date: {pip.startDate}</p>
              <p>End Date: {pip.endDate}</p>
              <p>Status: {pip.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PIPlist;
