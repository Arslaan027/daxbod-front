import { useState, useEffect } from "react";
import { format } from "date-fns"; // For formatting date and time
import { FaRegClock } from "react-icons/fa"; // Importing a React Icon

const UserDaxbod = () => {
  const [attendance, setAttendance] = useState([
    { date: "2024-09-12 08:30:00", day: "Thursday" },
    { date: "2024-09-11 09:00:00", day: "Wednesday" },
    { date: "2024-09-10 08:45:00", day: "Tuesday" },
    { date: "2024-09-09 08:55:00", day: "Monday" },
    { date: "2024-09-08 08:50:00", day: "Sunday" },
    { date: "2024-09-07 09:10:00", day: "Saturday" },
    { date: "2024-09-06 09:00:00", day: "Friday" },
    { date: "2024-09-05 08:40:00", day: "Thursday" },
    { date: "2024-09-04 08:30:00", day: "Wednesday" },
    { date: "2024-09-03 08:55:00", day: "Tuesday" },
  ]);
  const [message, setMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(
    format(new Date(), "yyyy-MM-dd HH:mm:ss")
  ); // State for the current time

  // Function to handle updating the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
    }, 1000); // Updates every 1 second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handlePunchIn = async () => {
    try {
      const now = new Date();
      const formattedDate = format(now, "yyyy-MM-dd HH:mm:ss");
      const dayOfWeek = format(now, "EEEE"); // Get day of the week

      // Assuming you have an endpoint to handle punch-in
      const response = await fetch("/api/punch-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp: formattedDate }),
      });

      if (response.ok) {
        setAttendance((prev) => [
          ...prev,
          { date: formattedDate, day: dayOfWeek },
        ]);
        setMessage("Punch-in successful!");
      } else {
        setMessage("Punch-in failed.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-24 ml-64">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (Punch In + New Section) */}
        <div className="space-y-6">
          {/* Punch-In Section */}
          <div className="p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto">
            <h1 className="text-xl font-semibold mb-4 text-center">Punch In</h1>
            <div className="flex flex-col items-center space-y-4">
              {/* Live Clock with Border */}
              <div className="border border-gray-300 rounded-lg p-4 w-full flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">Time</h3>
                {/* Time */}
                <p className="text-3xl font-semibold mb-1">{currentTime}</p>
                {/* Date */}
                {/* <p className="text-sm text-gray-500">
                  {format(new Date(), "yyyy-MM-dd")}
                </p> */}
              </div>

              {/* Punch In Button */}
              <button
                onClick={handlePunchIn}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2"
              >
                <FaRegClock />
                <span className="text-sm">Punch In</span>
              </button>

              {/* Success or Error Message */}
              {message && (
                <p
                  className={`mt-2 text-sm ${
                    message.includes("successful")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* New Section */}
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
            <p className="text-gray-600 mb-4">
              Your overall performance for this month has been excellent! Keep
              up the good work.
            </p>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Attendance Rate: 95%</li>
              <li>Projects Completed: 3</li>
              <li>Goals Achieved: 4 out of 5</li>
            </ul>
            <h3 className="text-lg font-semibold mt-4">Late Coming Policy:</h3>
            <p className="text-gray-600">
              Please note that repeated late punch-ins may affect your
              performance rating. Ensure to arrive on time to avoid penalties.
            </p>
          </div>
        </div>

        {/* Right Column (Full Attendance Table) */}
        <div className="col-span-2 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Punch-In Records</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Day</th>
                <th className="py-2 px-4 border-b text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length > 0 ? (
                attendance
                  .slice(-10) // Show only the last 10 punch-ins
                  .map((entry, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">
                        {format(new Date(entry.date), "yyyy-MM-dd")}
                      </td>
                      <td className="py-2 px-4 border-b">{entry.day}</td>
                      <td className="py-2 px-4 border-b">
                        {format(new Date(entry.date), "HH:mm:ss")}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td className="py-2 px-4 border-b text-center" colSpan="3">
                    No records available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDaxbod;
