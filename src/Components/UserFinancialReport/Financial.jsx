import React from "react";

const Financial = ({ salaryData }) => {
  const formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="p-8 max-w-screen-2xl md:ml-64 mx-auto mt-16 bg-gray-100">
      <h1 className="text-2xl md:text-4xl font-bold text-gray-700 mb-6 text-center">
        My Financial Year Report
      </h1>

      {/* Table for desktop */}
      <div className="hidden md:block">
        {salaryData.length > 0 ? (
          <table className="w-full table-auto border-collapse text-gray-600">
            <thead>
              <tr className="bg-gradient-to-r from-gray-300 to-gray-500 text-white">
                <th className="border px-4 py-3 text-left">Month</th>
                <th className="border px-4 py-3 text-right">Basic Salary</th>
                <th className="border px-4 py-3 text-right">HRA</th>
                <th className="border px-4 py-3 text-right">
                  Medical Allowance
                </th>
                <th className="border px-4 py-3 text-right">Food Allowance</th>
                <th className="border px-4 py-3 text-right">Conveyance</th>
                <th className="border px-4 py-3 text-right">
                  Education Allowance
                </th>
                <th className="border px-4 py-3 text-right">Incentives</th>
                <th className="border px-4 py-3 text-right">Total Salary</th>
              </tr>
            </thead>
            <tbody>
              {salaryData.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition duration-200 ease-in-out`}
                >
                  <td className="border px-4 py-3">{item.month}</td>
                  <td className="border px-4 py-3 text-right">
                    {formatCurrency(item.basic)}
                  </td>
                  <td className="border px-4 py-3 text-right">
                    {formatCurrency(item.hra)}
                  </td>
                  <td className="border px-4 py-3 text-right">
                    {formatCurrency(item.medicalAllowance)}
                  </td>
                  <td className="border px-4 py-3 text-right">
                    {formatCurrency(item.foodAllowance)}
                  </td>
                  <td className="border px-4 py-3 text-right">
                    {formatCurrency(item.conveyance)}
                  </td>
                  <td className="border px-4 py-3 text-right">
                    {formatCurrency(item.educationAllowance)}
                  </td>
                  <td className="border px-4 py-3 text-right">
                    {formatCurrency(item.incentives)}
                  </td>
                  <td className="border px-4 py-3 text-right font-semibold">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center mt-6">
            No salary data available.
          </p>
        )}
      </div>

      {/* Grid layout for mobile */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {salaryData.length > 0 ? (
          salaryData.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-md bg-gray-50"
            >
              <h2 className="text-lg font-bold mb-2">{item.month}</h2>
              <p className="text-gray-700 flex justify-between">
                <div>Basic Salary:</div>
                <div>{formatCurrency(item.basic)}</div>
              </p>
              <p className="text-gray-700 flex justify-between">
                <div>HRA:</div> <div>{formatCurrency(item.hra)}</div>
              </p>
              <p className="text-gray-700 flex justify-between">
                <div>Medical Allowance: </div>{" "}
                <div>{formatCurrency(item.medicalAllowance)}</div>
              </p>
              <p className="text-gray-700 flex justify-between">
                <div>Food Allowance: </div>
                <div>{formatCurrency(item.foodAllowance)}</div>
              </p>
              <p className="text-gray-700 flex justify-between">
                <div>Conveyance: </div>
                <div>{formatCurrency(item.conveyance)}</div>
              </p>
              <p className="text-gray-700 flex justify-between">
                <div>Education Allowance: </div>{" "}
                <div>{formatCurrency(item.educationAllowance)}</div>
              </p>
              <p className="text-gray-700 flex justify-between">
                <div> Incentives: </div>{" "}
                <div>{formatCurrency(item.incentives)}</div>
              </p>
              <hr className="mt-4 " />
              <p className="text-gray-800 font-semibold flex justify-between">
                <div>Total Salary:</div>{" "}
                <div> {formatCurrency(item.total)}</div>
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-6">
            No salary data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Financial;
