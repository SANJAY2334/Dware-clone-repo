import { useState } from "react";
import { FaFileExcel, FaTrash, FaPlay, FaPlus } from "react-icons/fa";
import AddDBCompareModal from "../../components/AddDBCompareModal";


const DBComparison = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to add a new row from the modal
  const handleAdd = (newEntry) => {
    setData([...data, { ...newEntry, id: Date.now() }]);
  };

  // Function to delete selected rows
  const handleDelete = () => {
    setData(data.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
  };

  // Function to simulate running the comparison
  const handleRun = () => {
    alert("Comparison running...");
  };

  // Function to export data to Excel
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DBComparison");
    XLSX.writeFile(workbook, "DB_Comparison.xlsx");
  };

  // Handle row selection
  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 rounded-2xl bg-gray-100 min-h-screen">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900">DB Comparison</h2>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <FaPlus /> <span>Add DB Compare</span>
        </button>
        <button
          onClick={handleDelete}
          disabled={selectedRows.length === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            selectedRows.length > 0
              ? "bg-gray-500 hover:bg-gray-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FaTrash /> <span>Delete</span>
        </button>
        <button
          onClick={handleRun}
          className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          <FaPlay /> <span>Run</span>
        </button>
        <FaFileExcel
          onClick={handleExport}
          className="text-green-600 text-3xl cursor-pointer hover:opacity-80"
        />
      </div>

      {/* Table */}
      <div className="mt-4 bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left w-12">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  onChange={(e) =>
                    setSelectedRows(
                      e.target.checked ? data.map((row) => row.id) : []
                    )
                  }
                  checked={selectedRows.length === data.length && data.length > 0}
                />
              </th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Source Type</th>
              <th className="p-3 text-left">Source Type Name</th>
              <th className="p-3 text-left">Target Type</th>
              <th className="p-3 text-left">Target Type Name</th>
              <th className="p-3 text-left">Created By</th>
              <th className="p-3 text-left">Updated By</th>
              <th className="p-3 text-left">Comment</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="11" className="p-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </td>
                  <td className="p-3">Edit</td>
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{row.type}</td>
                  <td className="p-3">{row.sourceType}</td>
                  <td className="p-3">{row.sourceTypeName}</td>
                  <td className="p-3">{row.targetType}</td>
                  <td className="p-3">{row.targetTypeName}</td>
                  <td className="p-3">{row.createdBy}</td>
                  <td className="p-3">{row.updatedBy}</td>
                  <td className="p-3">{row.comment}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <AddDBCompareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600">
          Showing {data.length === 0 ? 0 : 1} to {data.length} of {data.length}{" "}
          entries
        </p>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border rounded-md">«</button>
          <button className="px-3 py-1 border bg-blue-500 text-white rounded-md">
            1
          </button>
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

export default DBComparison;
