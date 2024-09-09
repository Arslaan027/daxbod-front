import React from "react";
import Title from "./Title";
import { FaAward } from "react-icons/fa";

const Balance = ({ darkMode }) => {
  const employee = {
    name: "Arslaan Ahmad",
    position: "Software Engineer",
    achievements: [
      "Led the successful launch of Project X",
      "Improved code quality by 30%",
      "Mentored 5 junior developers",
      "Led the successful launch of Project X",
      "Improved code quality by 30%",
      "Mentored 5 junior developers",
    ],
    month: "August 2024",
    image: "src/Images/arslaan.jpg",
  };
  return (
    <div className="bg-white p-5 rounded-2xl dark:bg-gray-900 dark:text-gray-300 flex-1">
      <div className="flex justify-between items-center mb-4">
        <Title>Employee of the Month</Title>
        <FaAward className="text-gray-500 h-8 w-8" />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <img
          src={employee.image}
          alt={employee.name}
          className="w-16 h-16 rounded-full object-cover shadow-md"
        />
        <div>
          <h1 className="text-xl font-bold">{employee.name}</h1>
          <p className="text-gray-400">{employee.position}</p>
          <span className="text-gray-400">{employee.month}</span>
        </div>
      </div>
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2">Achievements:</h1>
        <ul className="text-gray-400 list-disc list-inside">
          {employee.achievements.map((achievement, index) => (
            <li key={index} className="text-sm">
              {achievement}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end items-end">
        <div className="text-right flex gap-3 items-end">
          <button className="text-sm bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-100 dark:text-gray-100 py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Balance;
