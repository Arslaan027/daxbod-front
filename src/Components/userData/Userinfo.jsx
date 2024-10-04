import { useState, useEffect } from "react";
import axios from "axios"; // For making API requests
import { useNavigate } from "react-router-dom"; // For navigation on unauthorized access

const Userinfo = () => {
  const [userData, setUserData] = useState(null); // Holds fetched employee data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // For redirection if unauthorized

  useEffect(() => {
    // Function to extract empId and role from the token stored in localStorage
    const getEmpIdAndRoleFromToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return { empId: null, role: null };
      }

      try {
        // Decode the token payload (base64 decode)
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const empId = decodedToken.empId;
        const role = decodedToken.role;
        // console.log(`empId: ${empId}, role: ${role}`);
        return { empId, role };
      } catch (err) {
        console.error("Error decoding token:", err);
        return { empId: null, role: null };
      }
    };

    // Function to fetch the employee's data based on the empId
    const fetchEmployeeData = async () => {
      const { empId, role } = getEmpIdAndRoleFromToken();

      // Check if the user is authorized (i.e., they are an employee, admin, or HR)
      if (!empId || !["EMP", "ADMIN", "HR"].includes(role)) {
        setError(
          "Unauthorized access. Only employees, admins, and HR can view this data."
        );
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token not provided. Please login.");
          navigate("/login"); // Redirect to login if necessary
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/hr-management/emp/employee/${empId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token in Authorization header
            },
          }
        );
        setUserData(response.data[0]); // Set the fetched data
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError("Failed to fetch employee data.");
      } finally {
        setLoading(false); // Stop the loading state once API call completes
      }
    };

    fetchEmployeeData(); // Fetch employee data on component mount
  }, [navigate]);

  // Show loading state
  if (loading) {
    return <div className="text-center py-20">Loading employee data...</div>;
  }

  // Show error message if any
  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  // If no user data found
  if (!userData) {
    return <div className="text-center py-20">No employee data found.</div>;
  }

  // Render employee data once fetched
  return (
    <div className="min-h-screen bg-gray-100 py-12 flex items-center justify-center md:ml-64">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Your Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee Details */}
          <div className="border-r border-gray-200 pr-4">
            <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
            <ul className="space-y-4">
              <li>
                <span className="font-bold">Employee ID:</span> {userData.empId}
              </li>
              <li>
                <span className="font-bold">Name:</span> {userData.name}
              </li>
              <li>
                <span className="font-bold">Date of Joining:</span>{" "}
                {userData.doj}
              </li>
              <li>
                <span className="font-bold">Designation:</span>{" "}
                {userData.designation}
              </li>
              <li>
                <span className="font-bold">Department:</span> {userData.dept}
              </li>
              <li>
                <span className="font-bold">Reporting Manager:</span>{" "}
                {userData.reportingManager}
              </li>
              <li>
                <span className="font-bold">Employment Type:</span>{" "}
                {userData.employment_type}
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="pl-4">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <ul className="space-y-4">
              <li>
                <span className="font-bold">Email:</span> {userData.userEmail}
              </li>
              <li>
                <span className="font-bold">Phone:</span> {userData.phone_no}
              </li>
              <li>
                <span className="font-bold">Date of Birth:</span> {userData.dob}
              </li>
              <li>
                <span className="font-bold">Country:</span> {userData.country}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userinfo;
