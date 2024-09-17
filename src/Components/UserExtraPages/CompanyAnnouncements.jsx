import { useState } from "react";
import { FaCalendarAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

// Sample announcement data
const announcements = [
  {
    date: "2024-09-15",
    title: "New Office Opening",
    details:
      "We are thrilled to announce the grand opening of our new office located in the heart of San Francisco. Join us for the opening ceremony on September 15th!",
  },
  {
    date: "2024-09-10",
    title: "Updated Health Guidelines",
    details:
      "In response to recent developments, we have updated our health and safety guidelines. Please review the new protocols on our compliance page to ensure your safety.",
  },
  {
    date: "2024-09-05",
    title: "Quarterly Results Released",
    details:
      "Our latest quarterly financial results have been published. Explore the detailed report on our dashboard to see how we've performed this quarter.",
  },
];

// AnnouncementCard Component
const AnnouncementCard = ({ announcement }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600 flex items-center">
          <FaCalendarAlt className="mr-2 text-gray-500" />
          {announcement.date}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      <div
        className={`p-4 overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-14"
        }`}
      >
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          {announcement.title}
        </h3>
        <p
          className={`text-gray-700 transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {announcement.details}
        </p>
      </div>
    </div>
  );
};

// CompanyAnnouncements Component
const CompanyAnnouncements = () => {
  return (
    <div className="p-6 md:ml-64 pt-24 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Company Announcements
      </h2>
      <ul className="space-y-6">
        {announcements.map((announcement, index) => (
          <li key={index}>
            <AnnouncementCard announcement={announcement} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyAnnouncements;
