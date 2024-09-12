import { useState, useEffect, useCallback } from "react";
import Title from "../../Daxbod/Title";
import SearchBar from "./SearchBar";
import DepartmentFilter from "./DepartmentFilter";
// import { MdCancel } from "react-icons/md";
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

const Members = ({ onDetailsClick }) => {
  const [dataFromDb, setDataFromDb] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    empId: "",
    id: "",
    name: "",
    doj: "",
    designation: "",
    dept: "",
    reportingManager: "",
    role: "",
    userEmail: "",
    folderName: "",
    password: "",
    is_admin: "No", // Default value for is_admin
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
        console.log(res);
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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log("Submitting employee data:", newEmployee);

      try {
        if (editingEmployee) {
          const res = await axios.put(
            `http://localhost:3000/hr-management/emp/update-employee/${newEmployee.id}`, // Use empId
            newEmployee
          );
          console.log("Update response:", res.data);

          setDataFromDb((prevUsers) =>
            prevUsers.map((user) =>
              user.empId === newEmployee.id ? res.data : user
            )
          );
          setEditingEmployee(null);
        } else {
          const res = await axios.post(
            "http://localhost:3000/hr-management/emp/add-employee",
            newEmployee
          );
          console.log("Add response:", res.data);
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

  const handleRemoveEmployee = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/hr-management/emp/delete-employee/${id}`
      );
      setDataFromDb((prev) => prev.filter((user) => user.id !== id));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error(`Error removing employee: ${err}`);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee); // Mark the employee as being edited
    setNewEmployee({
      empId: employee.empId || "",
      id: employee.id || "",
      name: employee.name || "",
      doj: employee.doj || "",
      designation: employee.designation || "",
      dept: employee.dept || "",
      reportingManager: employee.reportingManager || "",
      role: employee.role || "",
      userEmail: employee.userEmail || "",
      folderName: employee.folderName || "",
      password: "", // Clear password for security reasons
      is_admin: employee.is_admin || "No",
      phone_no: employee.phone_no || "",
      dob: employee.dob || "",
      country: employee.country || "",
      employment_type: employee.employment_type || "",
    });
    setShowForm(true); // Display the form for editing
  };

  const handleShowDetails = (employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div>
      <Title title="Employee Management" />
      <SearchBar query={query} setQuery={setQuery} />
      <DepartmentFilter
        selectedDepartments={selectedDepartments}
        onCheckboxChange={handleCheckboxChange}
        departments={Array.from(
          new Set(dataFromDb.map((employee) => employee.dept))
        )}
      />
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
      >
        <IoMdPersonAdd className="mr-2" /> Add Employee
      </button>
      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-3xl grid grid-cols-2 gap-4">
            <button
              type="button"
              className="absolute top-[100px] right-[500px] text-gray-600 bg-black hover:text-gray-900 transition-colors duration-200"
              onClick={() => setShowForm(false)}
            >
              <SlClose size={50} />
            </button>
            <h2 className="col-span-2 text-lg font-semibold mb-3 text-gray-800">
              {editingEmployee ? "Edit Employee" : "Add Employee"}
            </h2>
            {Object.keys(fieldLabels).map((key, index) => {
              if (key !== "image") {
                const isRightSide = index % 2 === 1; // Alternates between left and right
                return (
                  <div
                    key={key}
                    className={`mb-2 ${
                      isRightSide ? "col-start-2" : "col-start-1"
                    }`}
                  >
                    <label
                      htmlFor={key}
                      className="block text-gray-700 mb-1 font-medium text-xs"
                    >
                      {fieldLabels[key]}
                    </label>
                    <input
                      type={key === "password" ? "password" : "text"}
                      id={key}
                      name={key}
                      value={newEmployee[key] || ""}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-xs"
                    />
                  </div>
                );
              }
              return null;
            })}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded-md col-span-2 mt-3 hover:bg-blue-700 transition-colors duration-200 text-xs"
            >
              {editingEmployee ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Employee List</h2>
        <table className="w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2">Actions</th>
              {Object.keys(fieldLabels).map((key) => (
                <th key={key} className="p-2">
                  {fieldLabels[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.empId}>
                <td className="p-2 flex items-center space-x-2">
                  <button
                    onClick={() => handleEditEmployee(user)}
                    className="text-blue-500"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleRemoveEmployee(user.empId)}
                    className="text-red-500"
                  >
                    <AiOutlineDelete />
                  </button>
                  <button
                    onClick={() => handleShowDetails(user)}
                    className="text-green-500"
                  >
                    <TbListDetails />
                  </button>
                </td>
                {Object.keys(fieldLabels).map((key) => (
                  <td key={key} className="p-2">
                    {user[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {selectedEmployee && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Employee Details</h3>
            <div className="border border-gray-300 p-4 rounded-lg">
              {Object.keys(fieldLabels).map((key) => (
                <div key={key} className="mb-2">
                  <span className="font-semibold">{fieldLabels[key]}:</span>{" "}
                  {selectedEmployee[key]}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
