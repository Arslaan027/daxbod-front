import { useState, useEffect, useCallback } from "react";
import Title from "../../Daxbod/Title";
import SearchBar from "./SearchBar";
import DepartmentFilter from "./DepartmentFilter";
import { IoMdPersonAdd } from "react-icons/io";
import axios from "axios";
import { TbListDetails } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { SlClose } from "react-icons/sl";

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
            newEmployee
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
      });
      setShowForm(false);
    },
    [newEmployee, editingEmployee]
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
          <button
            onClick={() => setShowForm(true)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-700 transition-colors duration-200"
          >
            <IoMdPersonAdd className="text-lg" />
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-[70vh] overflow-auto relative  dark:bg-gray-600">
            <button
              type="button"
              className="absolute top-8 right-12 text-gray-600 hover:text-gray-900 dark:text-gray-200"
              onClick={() => setShowForm(false)}
            >
              <SlClose size={24} />
            </button>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 h-full overflow-y-auto "
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                {editingEmployee ? "Edit Employee" : "Add Employee"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                {Object.keys(fieldLabels).map(
                  (key) =>
                    key !== "image" && (
                      <div key={key} className="flex flex-col ">
                        <label
                          htmlFor={key}
                          className="text-gray-700 font-medium text-sm mb-1 dark:text-gray-200"
                        >
                          {fieldLabels[key]}
                        </label>
                        <input
                          type={key === "password" ? "password" : "text"}
                          id={key}
                          name={key}
                          value={newEmployee[key] || ""}
                          onChange={handleFormChange}
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 text-sm dark:text-gray-200 dark:bg-gray-600"
                        />
                      </div>
                    )
                )}
              </div>
              <button
                type="submit"
                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm"
              >
                {editingEmployee ? "Update Employee" : "Add Employee"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Employee Table */}
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden dark:bg-gray-600 ">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-sm leading-normal dark:text-gray-300">
            <th className="py-3 px-6 text-left dark:text-gray-700">
              Employee ID
            </th>
            <th className="py-3 px-6 text-left dark:text-gray-700">Name</th>
            <th className="py-3 px-6 text-left dark:text-gray-700">
              Designation
            </th>
            <th className="py-3 px-6 text-left dark:text-gray-700">
              Department
            </th>
            <th className="py-3 px-6 text-left dark:text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm dark:text-gray-100">
          {filteredUsers.map((employee) => (
            <tr
              key={employee.empId}
              className="border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-400"
            >
              <td className="py-3 px-6">{employee.empId}</td>
              <td className="py-3 px-6">{employee.name}</td>
              <td className="py-3 px-6">{employee.designation}</td>
              <td className="py-3 px-6">{employee.dept}</td>
              <td className="py-3 px-6 flex gap-2">
                <button
                  onClick={() => handleEditEmployee(employee)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleRemoveEmployee(employee.empId)}
                  className="text-red-500 hover:text-red-700"
                >
                  <AiOutlineDelete />
                </button>
                <button
                  onClick={() => handleShowDetails(employee)}
                  className="text-green-500 hover:text-green-700"
                >
                  <TbListDetails />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-70 z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-[70vh] overflow-auto relative dark:bg-gray-600">
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 dark:text-gray-300 z-50"
              onClick={handleCloseDetails}
            >
              <SlClose size={24} />
            </button>

            {/* Modal Content */}
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-300">
              Employee Details
            </h2>
            <ul className="space-y-2 dark:text-gray-300">
              {Object.keys(selectedEmployee).map((key) => (
                <li
                  key={key}
                  className="flex justify-between dark:text-gray-300"
                >
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {fieldLabels[key] || key}:
                  </span>
                  <span>{selectedEmployee[key]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
