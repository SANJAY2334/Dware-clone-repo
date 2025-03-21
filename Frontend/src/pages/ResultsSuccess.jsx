import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";


const ResultsSuccess = () => {
  // Dummy data for successful results
  const successResults = [
    { id: 1, query: "SELECT * FROM users", rowsAffected: 150, time: "0.3s" },
    { id: 2, query: "UPDATE orders SET status='shipped'", rowsAffected: 45, time: "0.8s" },
  ];

  return (
    <div className="p-10">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-4">
        <CheckCircleIcon className="h-8 w-8 text-green-600" />
        <h2 className="text-2xl font-bold text-green-600">Success Results</h2>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border-collapse bg-white text-gray-700">
          <thead className="bg-green-100">
            <tr>
              <th className="border border-gray-300 p-3 text-left">ID</th>
              <th className="border border-gray-300 p-3 text-left">Query</th>
              <th className="border border-gray-300 p-3 text-center">Rows Affected</th>
              <th className="border border-gray-300 p-3 text-center">Execution Time</th>
            </tr>
          </thead>
          <tbody>
            {successResults.map((result) => (
              <tr key={result.id} className="hover:bg-green-100 transition-all">
                <td className="border border-gray-300 p-3">{result.id}</td>
                <td className="border border-gray-300 p-3 font-mono text-blue-600">{result.query}</td>
                <td className="border border-gray-300 p-3 text-center font-bold text-green-600">{result.rowsAffected}</td>
                <td className="border border-gray-300 p-3 text-center">{result.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsSuccess;
