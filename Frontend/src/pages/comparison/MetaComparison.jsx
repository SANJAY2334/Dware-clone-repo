import { useState } from "react";
import { FaPlus, FaTrash, FaPlay, FaFileExcel } from "react-icons/fa";
import AddMetaModal from "../../components/AddMetaModal";

const MetaComparison = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]); // ✅ Added state for row selection
  const [newMeta, setNewMeta] = useState({
    name: "",
    sourceType: "",
    targetType: "",
    sourceTypeName: "",
    targetTypeName: "",
    targetTable: "",
    Comments: "",
  });

  // Open modal & reset form
  const openModal = () => {
    setNewMeta({
      name: "",
      sourceType: "",
      targetType: "",
      sourceTypeName: "",
      targetTypeName: "",
      targetTable: "",
      Comments: "",
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => setShowModal(false);

  // Handle input change
  const handleChange = (e) => {
    setNewMeta({ ...newMeta, [e.target.name]: e.target.value });
  };

  // Add new meta comparison
  const handleSave = () => {
    if (!newMeta.name || !newMeta.sourceType || !newMeta.targetType) {
      alert("Please fill all required fields.");
      return;
    }

    const newData = {
      id: Date.now(),
      ...newMeta,
      sourceTable: "Table1",
      targetTable: "Table2",
      createdBy: "Admin",
    };

    setData([...data, newData]);
    closeModal();
  };

  // Delete selected meta comparisons
  const handleDeleteSelected = () => {
    setData(data.filter((item) => !selectedRows.includes(item.id)));
    setSelectedRows([]); // ✅ Clear selection after delete
  };

  // Delete a single meta comparison
  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  // Run process (Mock action)
  const handleRun = (id) => {
    alert(`Running comparison for ID: ${id}`);
  };

  // Export data (Mock action)
  const handleExport = () => {
    alert("Exporting data to Excel...");
  };

  // Toggle row selection
  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 rounded-2xl bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900">Meta Comparison</h2>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-4">
        <button
          onClick={openModal}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <FaPlus /> <span>Add Meta Compare</span>
        </button>

        <button
          onClick={handleDeleteSelected}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            selectedRows.length > 0
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          
        >
          <FaTrash /> <span>Delete </span>
        </button>

        <button
          onClick={handleRun}
          className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          <FaPlay /> <span>Run</span>
        </button>

        <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          <FaFileExcel /> <span>Export</span>
        </button>
      </div>

      {/* Modal */}
      <AddMetaModal
        showModal={showModal}
        onClose={closeModal}
        onSave={handleSave}
        newMeta={newMeta}
        handleChange={handleChange}
      />

      {/* Table */}
      <div className="mt-4 bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedRows(e.target.checked ? data.map((row) => row.id) : [])
                  }
                  checked={selectedRows.length === data.length && data.length > 0}
                />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Source Type</th>
              <th className="p-3 text-left">Target Type</th>
              <th className="p-3 text-left">Created By</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                    />
                  </td>
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{row.sourceType}</td>
                  <td className="p-3">{row.targetType}</td>
                  <td className="p-3">{row.createdBy}</td>
                  <td className="p-3 flex justify-center space-x-3">
                    {/* ✅ Delete Button */}
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      <FaTrash /> <span>Delete</span>
                    </button>

                    {/* ✅ Run Button */}
                    <button
                      onClick={() => handleRun(row.id)}
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

export default MetaComparison;
