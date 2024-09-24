import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SelectedForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [jobApplicationId, setJobApplicationId] = useState(id);
  console.log("jobApplicationId", jobApplicationId); // Set the job application ID from URL

  useEffect(() => {
    if (id) {
      console.log("Job Application ID:", id);
      // Fetch job application details or perform any necessary actions here
    }
  }, [id]);

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

    console.log("Job Application ID for submission:", jobApplicationId);
    const { imageFile, ...data } = formData;

    if (!imageFile) {
      alert("Please upload an image file");
      return;
    }

    if (!jobApplicationId) {
      alert("No job application ID provided");
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(data).forEach((key) => {
        formDataToSend.append(key, data[key]);
      });
      formDataToSend.append("image", imageFile);
      formDataToSend.append("jobApplicationId", jobApplicationId);

      const response = await axios.post(
        "http://localhost:3000/hr-management/emp/add-employee",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Correctly placed Authorization header
          },
        }
      );

      console.log(response.data.message);
      alert("Employee added successfully!");
      await handleDeleteJobApplication(jobApplicationId); // Pass correct jobApplicationId

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

  const handleDeleteJobApplication = async (jobApplicationId) => {
    console.log(jobApplicationId);
    if (!jobApplicationId) {
      console.error("No job application ID provided.");
      return;
    }

    console.log("Deleting job application ID:", jobApplicationId);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/hr-management/applicants/delete/${jobApplicationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete job application.");
      }

      const data = await response.json();
      console.log(data.message);
      alert("Job application deleted successfully!");

      setJobApplicationId(null);
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
            {/* Employee ID, Name, Date of Joining, Designation, Department, Reporting Manager */}
            {[
              "empId",
              "name",
              "doj",
              "designation",
              "dept",
              "reportingManager",
            ].map((field) => (
              <div key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type={field === "doj" || field === "dob" ? "date" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="w-1/2 space-y-4">
            {/* Role, Email, Password, Phone Number, Date of Birth, Country, Employment Type */}
            {[
              "role",
              "userEmail",
              "password",
              "phone_no",
              "dob",
              "country",
              "employment_type",
            ].map((field) => (
              <div key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type={
                    field === "userEmail"
                      ? "email"
                      : field === "phone_no"
                      ? "tel"
                      : "text"
                  }
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
              </div>
            ))}
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
