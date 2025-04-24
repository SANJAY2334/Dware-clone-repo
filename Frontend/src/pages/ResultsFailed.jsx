import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

const ResultsFailed = () => {
  // Dummy data for failed results
  const failedResults = [
    { id: 1, query: "SELECT * FROM invalid_table", error: "Table not found", time: "0.5s" },
    { id: 2, query: "INSERT INTO users VALUES ('test')", error: "Syntax Error", time: "1.2s" },
  ];

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4 text-red-600 flex items-center">
        <ExclamationCircleIcon className="w-7 h-7 text-red-600 mr-2" />
        Failed Results
      </h2>

      {/* Results Table */}
      <div className="overflow-x-auto shadow-xl">
        <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-3 text-left">ID</th>
              <th className="border border-gray-300 p-3 text-left">Query</th>
              <th className="border border-gray-300 p-3 text-left">Error Message</th>
              <th className="border border-gray-300 p-3 text-left">Execution Time</th>
            </tr>
          </thead>
          <tbody>
            {failedResults.map((result) => (
              <tr key={result.id} className="text-center bg-red-50 hover:bg-red-100 transition">
                <td className="border border-gray-300 p-3">{result.id}</td>
                <td className="border border-gray-300 p-3 text-gray-700">{result.query}</td>
                <td className="border border-gray-300 p-3 text-red-600 flex items-center justify-center gap-2">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                  <span className="relative group cursor-pointer">
                    {result.error}
                    <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1">
                      Click for details
                    </span>
                  </span>
                </td>
                <td className="border border-gray-300 p-3 text-gray-700">{result.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsFailed;
