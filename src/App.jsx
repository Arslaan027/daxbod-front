import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./Components/Layout";
import Dashboard from "./Components/Daxbod/Dashboard";
import Employee from "./Components/Pages/Employee/Employee";
import Payroll from "./Components/Pages/Payroll/Payroll";
import LeaveManagement from "./Components/Pages/Payroll/LeaveManagement";
import Login from "./Components/Pages/Login/Login";
import Inventory from "./Components/Pages/Inveentory/Inventory";
import Signup from "./Components/Pages/Signup/Signup";
import LMS from "./Components/Pages/LMS/LMS";
import JobApplication from "./Components/Pages/Job-Application/JobApplication";
import Form from "../src/Components/Pages/ApplicationForm/Applicationform";
import Team from "./Components/Daxbod/Team";
import UserDaxbod from "./Components/UserDaxbod/UserDaxbod";
import Financial from "./Components/UserFinancialReport/Financial";
import FeedbackSupport from "./Components/UserExtraPages/FeedbackSupport";
import CompliancePolicies from "./Components/UserExtraPages/CompliancePolicies";
import CompanyAnnouncements from "./Components/UserExtraPages/CompanyAnnouncements";
import Userinfo from "./Components/userData/Userinfo";
import SelectedForm from "./Components/Pages/Job-Application/SelectedForm";
import HoldApplications from "./Components/Pages/Job-Application/HoldApplications";
import EmpFeedbacks from "./Components/Pages/EmpFeedbacks/EmpFeedbacks";
import "./Components/scrollbar.css";
import Offboard from "./Components/UserOffBoarding/Offboard";
import Offboardfrom from "./Components/UserOffBoarding/Offboardfrom";

const salaryData = [
  {
    month: "April 2024",
    basic: 15000,
    hra: 6000,
    medicalAllowance: 1250,
    foodAllowance: 1000,
    conveyance: 1600,
    educationAllowance: 150,
    incentives: 2500,
    total: 27500,
  },
  {
    month: "May 2024",
    basic: 15000,
    hra: 6000,
    medicalAllowance: 1250,
    foodAllowance: 1000,
    conveyance: 1600,
    educationAllowance: 150,
    incentives: 2500,
    total: 27500,
  },
  {
    month: "June 2024",
    basic: 15000,
    hra: 6000,
    medicalAllowance: 1250,
    foodAllowance: 1000,
    conveyance: 1600,
    educationAllowance: 150,
    incentives: 2500,
    total: 27500,
  },
  {
    month: "July 2024",
    basic: 15000,
    hra: 6000,
    medicalAllowance: 1250,
    foodAllowance: 1000,
    conveyance: 1600,
    educationAllowance: 150,
    incentives: 2500,
    total: 27500,
  },
  {
    month: "August 2024",
    basic: 15000,
    hra: 6000,
    medicalAllowance: 1250,
    foodAllowance: 1000,
    conveyance: 1600,
    educationAllowance: 150,
    incentives: 2500,
    total: 27500,
  },
  {
    month: "September 2024",
    basic: 15000,
    hra: 6000,
    medicalAllowance: 1250,
    foodAllowance: 1000,
    conveyance: 1600,
    educationAllowance: 150,
    incentives: 2500,
    total: 27500,
  },
  {
    month: "October 2024",
    basic: 15000,
    hra: 6000,
    medicalAllowance: 1250,
    foodAllowance: 1000,
    conveyance: 1600,
    educationAllowance: 150,
    incentives: 2500,
    total: 27500,
  },
  {
    month: "November 2024",
    basic: 15000,
    hra: 6000,
    medicalAllowance: 1250,
    foodAllowance: 1000,
    conveyance: 1600,
    educationAllowance: 150,
    incentives: 2500,
    total: 27500,
  },
  {
    month: "December 2024",
    basic: 15000,
    hra: 6000,
    medicalAllowance: 1250,
    foodAllowance: 1000,
    conveyance: 1600,
    educationAllowance: 150,
    incentives: 2500,
    total: 27500,
  },
  {
    month: "January 2025",
    basic: 15000,
    hra: 6000,
    medicalAllowance: 1250,
    foodAllowance: 1000,
    conveyance: 1600,
    educationAllowance: 150,
    incentives: 2500,
    total: 27500,
  },
  {
    month: "February 2025",
    basic: 15000,
    hra: 6000,
    medicalAllowance: 1250,
    foodAllowance: 1000,
    conveyance: 1600,
    educationAllowance: 150,
    incentives: 2500,
    total: 27500,
  },
  {
    month: "March 2025",
    basic: 15000,
    hra: 6000,
    medicalAllowance: 1250,
    foodAllowance: 1000,
    conveyance: 1600,
    educationAllowance: 150,
    incentives: 2500,
    total: 27500,
  },
];

function App() {
  const [darkMode, setDarkMode] = React.useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const isAuthenticated = localStorage.getItem("loggedin") === "true";

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* Protected Routes */}
        {isAuthenticated ? (
          <Route
            path="/"
            element={
              <Layout
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
              />
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/user" element={<UserDaxbod />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/lms" element={<LMS />} />
            <Route
              path="/leave-management/:employeeId"
              element={<LeaveManagement />}
            />
            <Route path="/team/:id" element={<Team />} />
            <Route path="/payroll/:id" element={<Payroll />} />
            <Route path="/employee/:id" element={<Employee />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/job-application" element={<JobApplication />} />
            <Route path="/application-form" element={<Form />} />
            <Route path="/feedback" element={<FeedbackSupport />} />
            <Route path="/my-info" element={<Userinfo />} />
            <Route path="/selected/:id" element={<SelectedForm />} />
            <Route path="/hold-application" element={<HoldApplications />} />
            <Route path="/emp-feedbacks" element={<EmpFeedbacks />} />
            <Route path="/off-board" element={<Offboard />} />
            <Route path="/off-board-form" element={<Offboardfrom />} />

            <Route
              path="/compliance-policies"
              element={<CompliancePolicies />}
            />
            <Route
              path="/company-announcements"
              element={<CompanyAnnouncements />}
            />
            <Route
              path="/financial-report"
              element={<Financial salaryData={salaryData} />}
            />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
