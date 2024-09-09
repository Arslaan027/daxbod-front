import React, { useState, useEffect } from "react";
import logo from "../../../Images/newlogo.png";
import { useNavigate, Link } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import axios from "axios"; // Import axios for making API requests

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/hr-management/auth/signup",
        {
          name,
          userEmail: email,
          password,
          confirmPassword,
        }
      );

      if (response.status === 201) {
        alert("User signed up successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during signup:", error.message);
      alert("Signup failed: " + error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-gray-100 dark:bg-gray-800">
        {/* Left Section: Logo and Text */}
        <div className="bg-gray-700 dark:bg-gray-900 p-6 md:p-8 rounded-t-lg md:rounded-l-lg shadow-lg flex flex-col items-center justify-center md:w-1/2 mb-4 md:mb-0">
          <img
            src={logo}
            alt="Company Logo"
            className="mb-4 sm:mb-6 h-16 sm:h-20 md:h-24 w-auto"
          />
          <div className="font-[Outfit] text-white text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4 md:mb-2 text-center">
            Engineering and Environmental Solutions
          </div>
          <div className="text-white text-sm sm:text-md md:text-xl text-center">
            Creating Sustainable Tomorrows
          </div>
        </div>

        {/* Right Section: Sign Up Form */}
        <div className="relative bg-white dark:bg-gray-900 p-6 md:p-8 rounded-b-lg md:rounded-r-lg shadow-lg md:w-1/2">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="text-yellow-500" />
              ) : (
                <FaMoon className="text-gray-800" />
              )}
            </button>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-600 dark:text-gray-300 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-600 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-600 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-gray-600 dark:text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Confirm your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-4 text-gray-600 dark:text-gray-300 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-gray-900 dark:text-gray-200 font-semibold hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
