import { useState, useEffect, useCallback, useContext } from "react";
import Title from "../../Daxbod/Title";
import SearchBar from "./SearchBar";
import DepartmentFilter from "./DepartmentFilter";
import { IoMdPersonAdd } from "react-icons/io";
import axios from "axios";
import { TbListDetails } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import AuthContext from "../../AuthContext";

// Mapping for field names to labels
const fieldLabels = {
  empId: "Employee ID",
  name: "Name",
  doj: "Date of Joining",
  designation: "Designation",
  dept: "Department",
  reportingManager: "Reporting Manager",
  role: "Role",
  userEmail: "Email",
  folderName: "Folder Name",
  password: "Password",
  is_admin: "Is Admin",
  phone_no: "Phone Number",
  dob: "Date of Birth",
  country: "Country",
  employment_type: "Employment Type",
};

const Members = ({ onDetailsClick, darkMode }) => {
  const { user } = useContext(AuthContext); // Use AuthContext to get user data
  const userRole = user?.role || localStorage.getItem("role"); // Get the role of the current user from AuthContext or localStorage

  const [dataFromDb, setDataFromDb] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    empId: "",
    name: "",
    doj: "",
    designation: "",
    dept: "",
    reportingManager: "",
    role: "",
    userEmail: "",
    folderName: "",
    password: "",
    is_admin: "No",
    phone_no: "",
    dob: "",
    country: "",
    employment_type: "",
    imageFile: null,
  });
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/hr-management/emp/all-employee"
        );
        if (Array.isArray(res.data)) {
          setDataFromDb(res.data);
          setFilteredUsers(res.data);
        } else {
          console.error(
            "API response is not an array or does not contain data array"
          );
        }
      } catch (err) {
        console.error(`Error fetching data: ${err}`);
      }
    };

    fetchData();
  }, []);

  // Search Filter
  useEffect(() => {
    const searchResults = dataFromDb.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query.toLowerCase()) ||
        employee.empId.toLowerCase().includes(query.toLowerCase())
    );

    const departmentFilteredResults = selectedDepartments.length
      ? searchResults.filter((employee) =>
          selectedDepartments.includes(employee.dept)
        )
      : searchResults;

    setFilteredUsers(departmentFilteredResults);
  }, [query, selectedDepartments, dataFromDb]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (userRole !== "ADMIN") {
        console.error("You do not have permission to perform this action.");
        return;
      }

      const formData = new FormData();
      Object.keys(newEmployee).forEach((key) => {
        formData.append(key, newEmployee[key]);
      });

      if (newEmployee.imageFile) {
        formData.append("image", newEmployee.imageFile);
      }

      try {
        if (editingEmployee) {
          const res = await axios.put(
            `http://localhost:3000/hr-management/emp/update-employee/${newEmployee.empId}`,
            newEmployee
          );
          setDataFromDb((prevUsers) =>
            prevUsers.map((user) =>
              user.empId === newEmployee.empId ? res.data : user
            )
          );
          setEditingEmployee(null);
        } else {
          const res = await axios.post(
            "http://localhost:3000/hr-management/emp/add-employee",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          setDataFromDb((prevUsers) => [...prevUsers, res.data]);
        }
      } catch (err) {
        console.error(
          `Error ${editingEmployee ? "updating" : "adding"} employee: ${err}`
        );
      }

      setNewEmployee({
        empId: "",
        name: "",
        doj: "",
        designation: "",
        dept: "",
        reportingManager: "",
        role: "",
        userEmail: "",
        folderName: "",
        password: "",
        is_admin: "No",
        phone_no: "",
        dob: "",
        country: "",
        employment_type: "",
        imageFile: null,
      });
      setShowForm(false);
    },
    [newEmployee, editingEmployee, userRole]
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (department) => {
    setSelectedDepartments((prev) =>
      prev.includes(department)
        ? prev.filter((d) => d !== department)
        : [...prev, department]
    );
  };

  const handleBackClick = () => {
    setQuery("");
    setSelectedDepartments([]);
    setFilteredUsers(dataFromDb);
  };

  const handleRemoveEmployee = async (empId) => {
    if (userRole !== "ADMIN") {
      console.error("You do not have permission to perform this action.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3000/hr-management/emp/delete-employee/${empId}`
      );
      setDataFromDb((prev) => prev.filter((user) => user.empId !== empId));
      setFilteredUsers((prev) => prev.filter((user) => user.empId !== empId));
    } catch (err) {
      console.error(`Error removing employee: ${err}`);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      empId: employee.empId || "",
      name: employee.name || "",
      doj: employee.doj || "",
      designation: employee.designation || "",
      dept: employee.dept || "",
      reportingManager: employee.reportingManager || "",
      role: employee.role || "",
      userEmail: employee.userEmail || "",
      folderName: employee.folderName || "",
      password: "",
      is_admin: employee.is_admin || "No",
      phone_no: employee.phone_no || "",
      dob: employee.dob || "",
      country: employee.country || "",
      employment_type: employee.employment_type || "",
    });
    setShowForm(true);
  };

  const handleShowDetails = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseDetails = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="p-4 min-w-full">
      <div className="flex flex-wrap justify-between items-center mb-4">
        {/* Left Section: Title */}
        <div>
          <Title>Employee</Title>
        </div>

        {/* Right Section: Search Bar, Department Filter, and Add Button */}
        <div className="flex gap-3 items-center">
          {/* Search Bar */}
          <SearchBar query={query} setQuery={setQuery} />

          {/* Department Filter */}
          <DepartmentFilter
            selectedDepartments={selectedDepartments}
            onCheckboxChange={handleCheckboxChange}
            departments={Array.from(
              new Set(dataFromDb.map((employee) => employee.dept))
            )}
          />

          {/* Add Employee Button */}
          {userRole === "ADMIN" && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-700 transition-colors duration-200"
            >
              <IoMdPersonAdd className="text-lg" />
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-[70vh] overflow-auto relative dark:bg-gray-600">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setShowForm(false)}
            >
              <SlClose />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingEmployee ? "Edit Employee" : "Add Employee"}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Render form fields based on role */}
              {Object.keys(newEmployee).map((field) => {
                if (
                  userRole === "ADMIN" ||
                  (field !== "folderName" &&
                    field !== "password" &&
                    field !== "is_admin")
                ) {
                  return (
                    <div key={field} className="mb-4">
                      <label
                        className="block text-gray-700 dark:text-gray-300"
                        htmlFor={field}
                      >
                        {fieldLabels[field] || field}
                      </label>
                      <input
                        type={field === "password" ? "password" : "text"}
                        name={field}
                        id={field}
                        value={newEmployee[field] || ""}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2"
                        required
                      />
                    </div>
                  );
                }
                return null;
              })}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  {editingEmployee ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedEmployee && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-[70vh] overflow-auto relative dark:bg-gray-600">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={handleCloseDetails}
            >
              <SlClose />
            </button>
            <h2 className="text-xl font-bold mb-4">Employee Details</h2>
            {Object.entries(selectedEmployee).map(([key, value]) => (
              <div key={key} className="mb-2">
                <strong>{fieldLabels[key] || key}:</strong> {value || "N/A"}
              </div>
            ))}
          </div>
        </div>
      )}

      <table
        className={`w-full border-collapse ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <thead>
          <tr>
            <th className="border-b p-2">Actions</th>
            {Object.keys(fieldLabels).map((field) => (
              <th key={field} className="border-b p-2">
                {fieldLabels[field] || field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.empId} className="border-b">
              <td className="p-2">
                {userRole === "ADMIN" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditEmployee(user)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleRemoveEmployee(user.empId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AiOutlineDelete />
                    </button>
                    <button
                      onClick={() => handleShowDetails(user)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <TbListDetails />
                    </button>
                  </div>
                )}
              </td>
              {Object.keys(fieldLabels).map((field) => (
                <td key={field} className="p-2">
                  {user[field] || "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Members;
