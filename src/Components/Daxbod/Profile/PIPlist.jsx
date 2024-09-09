import React from "react";

const employees = [
  { id: 1, name: "John Doe", position: "Software Engineer" },
  { id: 2, name: "Jane Smith", position: "Project Manager" },
  { id: 3, name: "Alice Johnson", position: "UX Designer" },
  { id: 4, name: "Bob Brown", position: "Data Scientist" },
  { id: 5, name: "John Doe", position: "Software Engineer" },
  { id: 6, name: "Jane Smith", position: "Project Manager" },
  { id: 7, name: "Alice Johnson", position: "UX Designer" },
  { id: 8, name: "Tom Harris", position: "DevOps Engineer" },
];

const PIPlist = ({ darkMode }) => {
  return (
    <div className="flex flex-col gap-4 p-4 w-full max-h-[90vh] overflow-y-auto mx-auto ">
      {employees.map((employee, index) => (
        <div
          key={employee.id}
          className={`bg-white rounded-lg p-4 shadow-lg dark:text-gray-100 dark:bg-gray-900`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 dark:bg-gray-900">
            {employee.name}
          </h3>
          <p className=" text-gray-600 dark:text-gray-100">
            {employee.position}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PIPlist;
