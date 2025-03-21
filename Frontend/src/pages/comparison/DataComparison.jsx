import { useState } from "react";
import { FaPlus, FaTrash, FaPlay, FaFileExcel } from "react-icons/fa";
import AddCompareModal from "../../components/AddCompareModal";

const DataComparison = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [newComparison, setNewComparison] = useState({
    name: "",
    sourceType: "",
    targetType: "",
    uniqueKey: "",
    columns: "",
  });

  // Open modal
  const handleOpenModal = () => {
    setNewComparison({
      name: "",
      sourceType: "",
      targetType: "",
      uniqueKey: "",
      columns: "",
    });
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Handle input change
  const handleChange = (e) => {
    setNewComparison({ ...newComparison, [e.target.name]: e.target.value });
  };

  // Add new comparison
  const handleAddCompare = () => {
    if (
      !newComparison.name ||
      !newComparison.sourceType ||
      !newComparison.targetType ||
      !newComparison.uniqueKey ||
      !newComparison.columns
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setData([...data, { ...newComparison, id: Date.now() }]);
    setShowModal(false);
  };

  // Handle row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Delete selected rows
  const handleDelete = () => {
    setData(data.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
  };

  // Run process (Mock)
  const handleRun = () => {
    alert(`Running comparison for IDs: ${selectedRows.join(", ")}`);
  };

  // Export data (Mock)
  const handleExport = () => {
    alert("Exporting data to Excel...");
  };

  return (
    <div className="p-6 rounded-2xl bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900">Data Comparison</h2>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-5">
        <button
          onClick={handleOpenModal}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <FaPlus /> <span>Add Compare</span>
        </button>

        <button
          onClick={handleDelete}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            selectedRows.length > 0
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        
        >
          <FaTrash /> <span>Delete</span>
        </button>

        <button
          onClick={handleRun}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            selectedRows.length > 0
              ? "bg-gray-500 hover:bg-gray-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          
        >
          <FaPlay /> <span>Run</span>
        </button>

        <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <FaFileExcel /> <span>Export</span>
        </button>
      </div>

      {/* Table to Display Comparisons */}
      <div className="mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedRows(
                      e.target.checked ? data.map((row) => row.id) : []
                    )
                  }
                  checked={selectedRows.length === data.length && data.length > 0}
                />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Source Type</th>
              <th className="p-3 text-left">Target Type</th>
              <th className="p-3 text-left">Unique Key</th>
              <th className="p-3 text-left">Columns</th>
              <th className="p-3 text-center">Actions</th>
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
                <tr
                  key={row.id}
                  className="border-t hover:bg-gray-100 transition"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                    />
                  </td>
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{row.sourceType}</td>
                  <td className="p-3">{row.targetType}</td>
                  <td className="p-3">{row.uniqueKey}</td>
                  <td className="p-3">{row.columns}</td>
                  <td className="p-3 flex justify-center space-x-3">
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      <FaTrash /> <span>Delete</span>
                    </button>

                    {/* Run Button */}
                    <button
                      onClick={() => alert(`Running comparison for ID: ${row.id}`)}
                      className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition"
                    >
                      <FaPlay /> <span>Run</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Comparison Modal */}
      <AddCompareModal
        showModal={showModal}
        onClose={handleCloseModal}
        onSave={handleAddCompare}
        newComparison={newComparison}
        handleChange={handleChange}
      />

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

export default DataComparison;
