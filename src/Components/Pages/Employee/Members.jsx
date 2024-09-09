import React, { useState, useEffect, useCallback } from "react";
import Title from "../../Daxbod/Title";
import SearchBar from "./SearchBar";
import DepartmentFilter from "./DepartmentFilter";
import { useDropzone } from "react-dropzone";
import { MdCancel } from "react-icons/md";
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
  image: "Image",
  phone_no: "Phone Number",
  dob: "Date of Birth",
  country: "Country",
  employment_type: "Employment Type",
};

const Members = ({ onDetailsClick }) => {
  const [dataFromDb, setDataFromDb] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [image, setImage] = useState(null);
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
    is_admin: "No", // Default value for is_admin
    image: "",
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
      const formData = new FormData();
      Object.keys(newEmployee).forEach((key) => {
        formData.append(key, newEmployee[key]);
      });
      // Append the image if it exists
      if (image) {
        formData.append("image", image);
      }

      try {
        const res = await axios.post(
          "http://localhost:3000/hr-management/emp/add-employee",
          formData, // Pass formData directly
          {
            headers: {
              "Content-Type": "multipart/form-data", // Set the Content-Type to multipart/form-data
            },
          }
        );
        console.log(res);
        setDataFromDb((prevUsers) => [...prevUsers, res.data]);
      } catch (err) {
        console.error(`Error adding employee: ${err}`);
      }

      // Reset the form state
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
        image: "",
        phone_no: "",
        dob: "",
        country: "",
        employment_type: "",
      });
      setShowForm(false);
    },
    [newEmployee, setNewEmployee, setShowForm]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setImage(file);
        setNewEmployee((prev) => ({
          ...prev,
          image: URL.createObjectURL(file),
        }));
      }
    },
  });

  const filterUsers = useCallback(() => {
    let result = dataFromDb;
    if (query) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (selectedDepartments.length > 0) {
      result = result.filter((user) => selectedDepartments.includes(user.dept));
    }
    setFilteredUsers(result);
  }, [query, selectedDepartments, dataFromDb]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

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
    setEditingEmployee(employee);
    setNewEmployee(employee);
    setShowForm(true);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleShowDetails = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center relative mb-4">
        <Title>Employees</Title>
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            query={query}
            setQuery={setQuery}
            searchResult={filterUsers}
          />
          <DepartmentFilter
            selectedDepartments={selectedDepartments}
            handleCheckboxChange={handleCheckboxChange}
            toggleDropdown={() =>
              document
                .getElementById("dropdownDefaultCheckbox")
                .classList.toggle("hidden")
            }
          />
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="mr-2 bg-gray-500 text-white py-2 px-4 rounded-full flex items-center justify-center"
          >
            {showForm ? (
              <MdCancel className="text-xl" />
            ) : (
              <IoMdPersonAdd className="text-xl" />
            )}
          </button>
        </div>
      </div>
      {showForm && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            {editingEmployee ? "Edit Employee" : "Add New Employee"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(newEmployee).map((key) => (
                <div key={key} className="flex flex-col">
                  <label htmlFor={key} className="block text-gray-700 mb-2">
                    {fieldLabels[key]}
                  </label>
                  {key === "role" ? (
                    <select
                      id={key}
                      name={key}
                      value={newEmployee[key]}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                    >
                      <option value="">Select Role</option>
                      <option value="HR">HR</option>
                      <option value="Employee">Employee</option>
                    </select>
                  ) : key === "is_admin" ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={key}
                        name={key}
                        checked={newEmployee[key] === "Yes"}
                        onChange={() =>
                          setNewEmployee((prev) => ({
                            ...prev,
                            is_admin: prev.is_admin === "Yes" ? "No" : "Yes",
                          }))
                        }
                        className="mr-2"
                      />
                      <label htmlFor={key}>Admin</label>
                    </div>
                  ) : key === "image" ? (
                    <div className="relative">
                      <input
                        type="file"
                        id={key}
                        name={key}
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                      />
                      {newEmployee[key] && (
                        <img
                          src={newEmployee[key]}
                          alt="Preview"
                          className="mt-2 w-full max-h-32 object-cover rounded-md"
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      type={key === "password" ? "password" : "text"}
                      id={key}
                      name={key}
                      value={newEmployee[key]}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              {editingEmployee ? "Update" : "Add Employee"}
            </button>
          </form>
        </div>
      )}
      <div className="mt-6">
        {filteredUsers.length === 0 ? (
          <p>No employees found</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Department</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.dept}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEditEmployee(user)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleRemoveEmployee(user.id)}
                      className="text-red-500 hover:underline mr-2"
                    >
                      <AiOutlineDelete />
                    </button>
                    <button
                      onClick={() => handleShowDetails(user)}
                      className="text-green-500 hover:underline"
                    >
                      <TbListDetails />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {selectedEmployee && (
        <div
          id="employeeDetailsModal"
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
        >
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <SlClose className="text-xl" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
            <div className="space-y-4">
              {Object.keys(selectedEmployee).map((key) => (
                <div key={key} className="flex items-center">
                  <span className="font-semibold w-40">
                    {fieldLabels[key]}:
                  </span>
                  <span className="ml-2">{selectedEmployee[key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Members;
