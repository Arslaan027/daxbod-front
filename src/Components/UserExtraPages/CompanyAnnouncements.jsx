// CompanyAnnouncements.jsx

const announcements = [
  {
    date: "2024-09-15",
    title: "New Office Opening",
    details:
      "We are excited to announce the opening of our new office in San Francisco!",
  },
  {
    date: "2024-09-10",
    title: "Updated Health Guidelines",
    details:
      "Please review the updated health and safety guidelines on our compliance page.",
  },
  {
    date: "2024-09-05",
    title: "Quarterly Results Released",
    details:
      "Check out the latest quarterly financial results on the dashboard.",
  },
];

const CompanyAnnouncements = () => {
  return (
    <div className="p-4 ">
      <h2 className="text-2xl font-bold mb-4">Company Announcements</h2>

      <ul className="space-y-4">
        {announcements.map((announcement, index) => (
          <li key={index} className="border p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 mb-2">
              {announcement.date}
            </div>
            <h3 className="text-xl font-semibold mb-2">{announcement.title}</h3>
            <p>{announcement.details}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyAnnouncements;
