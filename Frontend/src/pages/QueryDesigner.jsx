import React, { useState } from "react";
import { FaPlay, FaTrash, FaPlus, FaClipboardList } from "react-icons/fa";
import AddQueryModal from "../components/AddQueryModal";

const QueryDesigner = () => {
  const [queryResult, setQueryResult] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to add a new query
  const handleAddQuery = (newQuery) => {
    setQueryResult((prev) => [...prev, { id: prev.length + 1, ...newQuery }]);
  };

  // Handle row selection
  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Handle "Select All"
  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(!selectAll ? queryResult.map((row) => row.id) : []);
  };

  // Delete selected queries
  const deleteSelectedQueries = () => {
    if (selectedRows.length === 0) {
      alert("Please select a query to delete.");
      return;
    }
    setQueryResult(queryResult.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
    setSelectAll(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Query Designer</h2>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-4">
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Add Query
        </button>
        <button
          className="flex items-center px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
          onClick={deleteSelectedQueries}
        >
          <FaTrash className="mr-2" /> Delete
        </button>
        <button className="flex items-center px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition">
          <FaClipboardList className="mr-2" /> Query Analysis
        </button>
      </div>

      {/* Query Execution Result */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-bold text-gray-700">Query Results</h3>
        {queryResult.length > 0 ? (
          <table className="w-full mt-3 border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-2">
                  <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                </th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Source Type</th>
                <th className="border border-gray-300 p-2">Function</th>
                <th className="border border-gray-300 p-2">Query</th>
                <th className="border border-gray-300 p-2">Created By</th>
              </tr>
            </thead>
            <tbody>
              {queryResult.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">{row.queryName}</td>
                  <td className="border border-gray-300 p-2">{row.sourceType}</td>
                  <td className="border border-gray-300 p-2">{row.function}</td>
                  <td className="border border-gray-300 p-2">{row.query}</td>
                  <td className="border border-gray-300 p-2">{row.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 mt-2">No results to display.</p>
        )}
      </div>

      {/* Add Query Modal */}
      <AddQueryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddQuery}
      />
    </div>
  );
};

export default QueryDesigner;
