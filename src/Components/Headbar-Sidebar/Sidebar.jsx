import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaChartLine,
  FaUsers,
  FaBookOpen,
  FaComments,
  FaFileContract,
  FaBullhorn,
  FaBoxes,
  FaBriefcase,
  FaClipboardList,
} from "react-icons/fa";
import { IoIosLogIn, IoIosPersonAdd } from "react-icons/io";
import { BiDetail } from "react-icons/bi";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("loggedin");
  const userRole = localStorage.getItem("role"); // Retrieve the role

  // Define links based on roles
  const hrLinks = [
    { to: "/", icon: FaTachometerAlt, text: "Dashboard" },
    { to: "/my-info", icon: BiDetail, text: "Employee Details" },

    {
      to: "/employee",
      icon: FaUsers,
      text: "Employee",
      badge: {
        text: " ",
        color: "bg-gray-100 text-gray-800",
        darkColor: "dark:bg-gray-700 dark:text-gray-300",
      },
    },
    { to: "/lms", icon: FaBookOpen, text: "LMS" },
    { to: "/inventory", icon: FaBoxes, text: "Inventory" },
  ];

  const userLinks = [
    { to: "/user", icon: FaTachometerAlt, text: "Dashboard" },
    { to: "/company-announcements", icon: FaBullhorn, text: "Announcements" },
    { to: "/my-info", icon: BiDetail, text: "Employee Details" },
    { to: "/financial-report", icon: FaChartLine, text: "Financial Report" },
    { to: "/feedback", icon: FaComments, text: "Feedback" },
    {
      to: "/compliance-policies",
      icon: FaFileContract,
      text: "Compliance Policies",
    },
  ];

  const adminLinks = [
    { to: "/", icon: FaTachometerAlt, text: "Dashboard" },
    {
      to: "/employee",
      icon: FaUsers,
      text: "Employee",
      badge: {
        text: " ",
        color: "bg-gray-100 text-gray-800",
        darkColor: "dark:bg-gray-700 dark:text-gray-300",
      },
    },
    { to: "/lms", icon: FaBookOpen, text: "LMS" },
    { to: "/inventory", icon: FaBoxes, text: "Inventory" },
    { to: "/company-announcements", icon: FaBullhorn, text: "Announcements" },
    { to: "/user", icon: FaTachometerAlt, text: "Dashboard" },
    { to: "/financial-report", icon: FaChartLine, text: "Financial Report" },
    { to: "/feedback", icon: FaComments, text: "Feedback" },
    {
      to: "/compliance-policies",
      icon: FaFileContract,
      text: "Compliance Policies",
    },
    { to: "/my-info", icon: BiDetail, text: "Employee Details" },

    { to: "/job-application", icon: FaBriefcase, text: "Job Application" },
    {
      to: "/application-form",
      icon: FaClipboardList,
      text: "Application Form",
    },
  ];

  // Determine which links to display based on user role
  let linksToDisplay = [];
  if (userRole === "ADMIN") {
    linksToDisplay = adminLinks;
  } else if (userRole === "HR") {
    linksToDisplay = hrLinks;
  } else if (userRole === "EMP") {
    linksToDisplay = userLinks;
  } else {
    console.warn("Unknown user role. Defaulting to empty links.");
  }

  const authLinks = [
    { to: "/login", icon: IoIosLogIn, text: "Log In" },
    { to: "/signup", icon: IoIosPersonAdd, text: "Sign Up" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 transition-transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {linksToDisplay.length > 0 ? (
            linksToDisplay.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.to}
                  onClick={toggleSidebar}
                  className={`flex items-center p-2 rounded-lg dark:text-white ${
                    location.pathname === link.to
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <link.icon className="mr-3" />
                  <span className="flex-1 me-3">{link.text}</span>
                  {link.badge && (
                    <span
                      className={`inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full ${link.badge.color} ${link.badge.darkColor}`}
                    >
                      {link.badge.text}
                    </span>
                  )}
                </Link>
              </li>
            ))
          ) : (
            <li>
              <span className="flex items-center p-2 rounded-lg text-gray-500 dark:text-gray-400">
                No Links Available
              </span>
            </li>
          )}
          {!isLoggedIn &&
            authLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.to}
                  onClick={toggleSidebar}
                  className={`flex items-center p-2 rounded-lg dark:text-white ${
                    location.pathname === link.to
                      ? "text-red-500 bg-gray-100 dark:bg-gray-700"
                      : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <link.icon className="mr-3" />
                  <span className="flex-1 me-3">{link.text}</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
