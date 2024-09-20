import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SelectedForm = () => {
  const [formData, setFormData] = useState({
    empId: "",
    name: "",
    doj: "",
    designation: "",
    dept: "",
    reportingManager: "",
    role: "",
    userEmail: "",
    password: "",
    phone_no: "",
    dob: "",
    country: "",
    employment_type: "",
    imageFile: null,
  });

  const navigate = useNavigate();

  const backButton = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (userRole !== "HR" && userRole !== "ADMIN") {
      alert("You do not have permission to add an employee.");
      return;
    }

    const { imageFile, ...data } = formData;

    const formDataToSend = new FormData();
    Object.keys(data).forEach((key) => {
      formDataToSend.append(key, data[key]);
    });
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    try {
      // Step 1: Submit employee data
      const response = await axios.post(
        "http://localhost:3000/hr-management/emp/add-employee",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.message); // Log the response to inspect its structure
      alert("Employee added successfully!");

      const id = response.data.id; // Ensure the back-end returns the job application ID

      // Step 2: Delete job application if ID is returned
      if (id) {
        await handleDeleteJobApplication(id);
      } else {
        console.error("Job application ID not found in response.");
      }

      // Reset form data
      setFormData({
        empId: "",
        name: "",
        doj: "",
        designation: "",
        dept: "",
        reportingManager: "",
        role: "",
        userEmail: "",
        password: "",
        phone_no: "",
        dob: "",
        country: "",
        employment_type: "",
        imageFile: null,
      });

      navigate("/employee");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Error adding employee. Please try again.");
    }
  };

  const handleDeleteJobApplication = async (id) => {
    console.log("Deleting job application ID:", id);
    try {
      const response = await fetch(
        `http://localhost:3000/hr-management/applicants/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete job application.");
      }

      const data = await response.json();
      console.log(data.message);
      alert("Job application deleted successfully!");
    } catch (error) {
      console.error("Error deleting job application:", error);
      alert("Error deleting job application. Please try again.");
    }
  };

  return (
    <div className="p-4 md:ml-64 md:mt-20">
      <h1 className="font-bold text-gray-700 text-center mb-10 text-2xl dark:text-gray-400">
        Add Employee
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-8">
          {/* Left Section */}
          <div className="w-1/2 space-y-4">
            <div>
              <label>Employee ID</label>
              <input
                type="text"
                name="empId"
                value={formData.empId}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label>Date of Joining</label>
              <input
                type="date"
                name="doj"
                value={formData.doj}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label>Department</label>
              <input
                type="text"
                name="dept"
                value={formData.dept}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label>Reporting Manager</label>
              <input
                type="text"
                name="reportingManager"
                value={formData.reportingManager}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-1/2 space-y-4">
            <div>
              <label>Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label>Employment Type</label>
              <input
                type="text"
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label>Profile Picture</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="border p-2 w-full"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={backButton}
          className="bg-gray-300 text-black py-2 px-4 rounded"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default SelectedForm;
