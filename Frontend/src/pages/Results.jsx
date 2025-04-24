import React, { useState } from "react";

const Results = () => {
  const [activeTab, setActiveTab] = useState("success");

  // Dummy data for results
  const resultsData = {
    success: [
      { id: 1, query: "SELECT * FROM users", status: "Success", time: "2s" },
      { id: 2, query: "SELECT * FROM orders", status: "Success", time: "1.5s" },
    ],
    failed: [
      { id: 3, query: "SELECT * FROM unknown_table", status: "Failed", time: "0.5s" },
    ],
  };

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-4">Results</h2>

      {/* Tabs */}
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "success" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("success")}
        >
          Success
        </button>
        <button
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "failed" ? "bg-red-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("failed")}
        >
          Failed
        </button>
      </div>

      {/* Results Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Query</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {resultsData[activeTab].map((result) => (
            <tr key={result.id} className="text-center">
              <td className="border border-gray-300 p-2">{result.id}</td>
              <td className="border border-gray-300 p-2">{result.query}</td>
              <td
                className={`border border-gray-300 p-2 ${
                  result.status === "Success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.status}
              </td>
              <td className="border border-gray-300 p-2">{result.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Results;
