import { useState } from "react";
import { FaFileExcel, FaTrash, FaFileAlt } from "react-icons/fa";

const DBRuns = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    setSelectedRows(e.target.checked ? data.map((row) => row.id) : []);
  };

  const handleDelete = () => {
    setData((prevData) => prevData.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900">Results – DB Runs</h2>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mt-4">
        {["All", "Day", "Week", "Month", "Custom"].map((filter) => (
          <button key={filter} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition">
            {filter}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-5">
        <button className="flex items-center space-x-2 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">
          <FaFileAlt /> <span>Report</span>
        </button>
        <button
          onClick={handleDelete}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            selectedRows.length > 0 ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={selectedRows.length === 0}
        >
          <FaTrash /> <span>Delete</span>
        </button>
        <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          <FaFileExcel /> <span>XLS</span>
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === data.length && data.length > 0}
                />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date and Time</th>
              <th className="p-3 text-left">Run Type</th>
              <th className="p-3 text-left">Executed By</th>
              <th className="p-3 text-center">View Report</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-100 transition">
                  <td className="p-3">
                    <input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => handleRowSelect(row.id)} />
                  </td>
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{row.status}</td>
                  <td className="p-3">{row.dateTime}</td>
                  <td className="p-3">{row.runType}</td>
                  <td className="p-3">{row.executedBy}</td>
                  <td className="p-3 text-center">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">View Report</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600">
          Showing {data.length === 0 ? 0 : 1} to {data.length} of {data.length} entries
        </p>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border rounded-md">«</button>
          <button className="px-3 py-1 border bg-blue-500 text-white rounded-md">1</button>
          <button className="px-3 py-1 border rounded-md">»</button>
          <select className="border p-1 rounded-md">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DBRuns;
