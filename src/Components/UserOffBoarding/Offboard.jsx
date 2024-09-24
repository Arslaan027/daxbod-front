import { useState, useEffect, useCallback, useContext } from "react";
import Title from "../../Components/Daxbod/Title"; // Ensure the path is correct
import SearchBar from "../../Components/Pages/Employee/SearchBar";
import AuthContext from "../AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../blink.css";

// Mapping for field names to labels
const fieldLabels = {
  empId: "Employee ID",
  name: "Name",
  designation: "Designation",
  dept: "Department",
};

const Offboard = ({ darkMode }) => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const userRole = user?.role || localStorage.getItem("role");

  const [dataFromDb, setDataFromDb] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newOffboard, setNewOffboard] = useState({
    empId: "",
    name: "",
    designation: "",
    dept: "",
    offboardDate: "",
  });
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:3000/hr-management/emp/all-employee",
          {
            headers: {
              Authorization: `Bearer ${
                user?.token || localStorage.getItem("token")
              }`,
            },
          }
        );
        if (Array.isArray(res.data)) {
          setDataFromDb(res.data);
          setFilteredUsers(res.data);
        }
      } catch (err) {
        console.error(`Error fetching data: ${err}`);
        setErrorMessage("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Search Filter
  useEffect(() => {
    const searchResults = dataFromDb.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query.toLowerCase()) ||
        employee.empId.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(searchResults);
  }, [query, dataFromDb]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (userRole !== "ADMIN") {
        setErrorMessage("You do not have permission to perform this action.");
        return;
      }

      try {
        const res = await axios.post(
          "http://localhost:3000/hr-management/emp/add-offboarded-employee",
          newOffboard,
          {
            headers: {
              Authorization: `Bearer ${
                user?.token || localStorage.getItem("token")
              }`,
            },
          }
        );
        setDataFromDb((prevUsers) => [...prevUsers, res.data]);
        setSuccessMessage("Offboarded employee added successfully!");
      } catch (err) {
        console.error(`Error adding offboarded employee: ${err}`);
        setErrorMessage("Error adding offboarded employee. Please try again.");
      }

      setNewOffboard({
        empId: "",
        name: "",
        designation: "",
        dept: "",
        offboardDate: "",
      });
      setShowForm(false);
    },
    [newOffboard, userRole]
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewOffboard((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (empId) => {
    if (userRole !== "ADMIN") {
      setErrorMessage("You do not have permission to perform this action.");
      return;
    }
    setSelectedEmpId(empId);
    setConfirmModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/hr-management/emp/delete-offboarded-employee/${selectedEmpId}`,
        {
          headers: {
            Authorization: `Bearer ${
              user?.token || localStorage.getItem("token")
            }`,
          },
        }
      );
      setDataFromDb((prev) =>
        prev.filter((employee) => employee.empId !== selectedEmpId)
      );
      setSuccessMessage("Employee offboarding record deleted successfully!");
    } catch (err) {
      console.error(`Error deleting employee: ${err}`);
      setErrorMessage("Error deleting employee. Please try again.");
    } finally {
      setConfirmModalOpen(false); // Close the confirmation modal
      setSelectedEmpId(""); // Reset selected employee ID
    }
  };

  const cancelDelete = () => {
    setConfirmModalOpen(false); // Close the confirmation modal without deleting
    setSelectedEmpId(""); // Reset selected employee ID
  };

  const handleConfirm = () => {
    navigate("/off-board-form");
  };

  return (
    <div
      className={`p-4 min-w-full mt-24 flex flex-col md:pl-72 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center mx-2">
        <Title title="Employee Offboarding" darkMode={darkMode}>
          Employee Offboarding
        </Title>
        <SearchBar query={query} setQuery={setQuery} />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="overflow-hidden mt-4">
            {/* Card View for Mobile and Table View for Desktop */}
            <div className="block md:hidden">
              {filteredUsers.map((employee) => (
                <div
                  key={employee.empId}
                  className={`border rounded-lg p-4 mb-4 ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <h3 className="text-lg font-bold">{employee.name}</h3>
                  <p>
                    <strong>{fieldLabels.empId}: </strong>
                    {employee.empId}
                  </p>
                  <p>
                    <strong>{fieldLabels.designation}: </strong>
                    {employee.designation}
                  </p>
                  <p>
                    <strong>{fieldLabels.dept}: </strong>
                    {employee.dept}
                  </p>
                  {userRole === "ADMIN" && (
                    <button
                      onClick={() => handleDelete(employee.empId)}
                      className="text-red-500 hover:underline mt-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Table View for Desktop */}
            <table
              className={`md:min-w-full border border-gray-300 rounded-lg overflow-hidden ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
            >
              <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <tr>
                  {Object.keys(fieldLabels).map((key) => (
                    <th
                      key={key}
                      className="p-3 text-left border-b border-gray-300"
                    >
                      {fieldLabels[key]}
                    </th>
                  ))}
                  {userRole === "ADMIN" && (
                    <th className="p-3 border-b border-gray-300">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((employee) => (
                  <tr
                    key={employee.empId}
                    className="hover:bg-gray-100 transition duration-200"
                  >
                    {Object.keys(fieldLabels).map((key) => (
                      <td
                        key={key}
                        className="p-3 border-b border-gray-300 truncate"
                        style={{ maxWidth: "150px" }}
                      >
                        {employee[key]}
                      </td>
                    ))}
                    {userRole === "ADMIN" && (
                      <td className="p-3 border-b border-gray-300 text-center">
                        <button
                          onClick={() => handleDelete(employee.empId)} // Call the confirmation dialog
                          className="text-red-500 hover:underline"
                        >
                          Off-Board
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {successMessage && (
            <div className="text-green-600 mt-4">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="text-red-600 mt-4">{errorMessage}</div>
          )}
        </div>
      )}
      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold">
              Confirm{" "}
              <span className="text-red-500 blinking">Off-Boarding</span>
            </h2>
            <p>Are you sure you want to Off-Board this employee record?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offboard;
