import React, { useState } from "react";
import logo from "../../../Images/newlogo.png";

const Form = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    qualification: "",
    positionAppliedFor: "",
    location: "",
    resume: null,
    dateOfBirth: "",
    yearOfPassing: "",
    phoneNumber: "",
    email: "",
    linkedInProfile: "",
    priorExperience: "No",
    experienceDuration: "",
    currentCTC: "",
    expectedCTC: "",
    dateApplied: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      resume: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        form.append(key, formData[key]);
      }
    }

    fetch("http://localhost:3000/hr-management/applicants/form-submit", {
      method: "POST",
      body: form,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Form submitted successfully:", data);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  const positions = [
    "Sales Executive",
    "Front-end Developer",
    "Back-end Developer",
    "Human Resource",
  ];
  const years = Array.from(
    { length: 50 },
    (_, i) => new Date().getFullYear() - i
  );
  console.log(years);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center mt-10 dark:bg-gray-800 dark:border-gray-800">
      <div className="w-4/5 md:w-3/5 lg:w-2/5 bg-white mx-auto shadow-lg p-8 rounded-xl md:my-20 lg:my-5 mt-20 dark:bg-gray-900 dark:border-gray-800">
        <h2 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-6 text-center flex items-center justify-center dark:text-white">
          <img
            src={logo}
            alt="company logo"
            className="h-6 sm:h-8 md:h-10 lg:h-12 mr-2"
          />
          Job Application
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap -mx-4">
          {/* Section 1 */}
          <div className="w-full md:w-1/2 px-4 mb-5">
            {/* Full Name */}
            <div className="mb-5">
              <label
                htmlFor="fullname"
                className="block text-gray-700 dark:text-white text-sm font-medium mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-600 dark:text-white focus:ring-gray-500"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="mb-5">
              <label
                htmlFor="phoneNumber"
                className="block text-gray-700 dark:text-white text-sm font-medium mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white"
                required
              />
            </div>

            {/* Year of Passing */}
            <div className="mb-5">
              <label
                htmlFor="yearOfPassing"
                className="block text-gray-700 dark:text-white text-sm font-medium mb-1"
              >
                Year of Passing
              </label>
              <input
                type="text"
                id="yearOfPassing"
                name="yearOfPassing"
                value={formData.yearOfPassing}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white"
                required
              />
            </div>

            {/* Position Applied For */}
            <div className="mb-5">
              <label
                htmlFor="positionAppliedFor"
                className="block text-gray-700 dark:text-white text-sm font-medium mb-1"
              >
                Position Applied For
              </label>
              <select
                id="positionAppliedFor"
                name="positionAppliedFor"
                value={formData.positionAppliedFor}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white"
                required
              >
                <option value="">Select Position</option>
                {positions.map((position, index) => (
                  <option key={index} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="mb-5">
              <label
                htmlFor="location"
                className="block text-gray-700 dark:text-white text-sm font-medium mb-1"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white"
                required
              />
            </div>

            {/* Expected CTC */}
            <div className="mb-5">
              <label
                htmlFor="expectedCTC"
                className="block text-gray-700 dark:text-white text-sm font-medium mb-1"
              >
                Expected CTC
              </label>
              <input
                type="text"
                id="expectedCTC"
                name="expectedCTC"
                value={formData.expectedCTC}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white"
                required
              />
            </div>

            {/* Upload Resume */}
            <div className="mb-5">
              <label
                htmlFor="resume"
                className="block text-gray-700 dark:text-white text-sm font-medium mb-1"
              >
                Upload Resume
              </label>
              <input
                type="file"
                id="resume"
                name="resume"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none dark:bg-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Section 2 */}
          <div className="w-full md:w-1/2 px-4 mb-5">
            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-1 dark:text-white"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white"
                required
              />
            </div>

            {/* Qualification */}
            <div className="mb-5">
              <label
                htmlFor="qualification"
                className="block text-gray-700 dark:text-white text-sm font-medium mb-1"
              >
                Qualification
              </label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white"
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="mb-5">
              <label
                htmlFor="dateOfBirth"
                className="block text-gray-700 dark:text-white text-sm font-medium mb-1"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white"
                required
              />
            </div>

            {/* LinkedIn Profile */}
            <div className="mb-5">
              <label
                htmlFor="linkedInProfile"
                className="block text-gray-700 dark:text-white text-sm font-medium mb-1"
              >
                LinkedIn Profile
              </label>
              <input
                type="url"
                id="linkedInProfile"
                name="linkedInProfile"
                value={formData.linkedInProfile}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white"
                required
              />
            </div>

            {/* Prior Experience */}
            <div className="mb-5">
              <label
                htmlFor="priorExperience"
                className="block text-gray-700 dark:text-white text-sm font-medium mb-1"
              >
                Prior Experience
              </label>
              <select
                id="priorExperience"
                name="priorExperience"
                value={formData.priorExperience}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white"
                required
              >
                <option value="">Select Experience</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {formData.priorExperience === "Yes" && (
              <div className="mb-5">
                {/* Experience Duration */}
                <div className="mb-5">
                  <label
                    htmlFor="experienceDuration"
                    className="block text-gray-700 text-sm font-medium mb-1 dark:text-white"
                  >
                    Experience Duration (in years)
                  </label>
                  <input
                    type="number"
                    id="experienceDuration"
                    name="experienceDuration"
                    value={formData.experienceDuration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>

                {/* Current CTC */}
                <div className="mb-5">
                  <label
                    htmlFor="currentCTC"
                    className="block text-gray-700 dark:text-white text-sm font-medium mb-1"
                  >
                    Current CTC
                  </label>
                  <input
                    type="text"
                    id="currentCTC"
                    name="currentCTC"
                    value={formData.currentCTC}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-gray-600 text-white px-4 py-2 rounded space-x-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
