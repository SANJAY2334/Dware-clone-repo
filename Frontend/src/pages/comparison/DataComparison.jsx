import { useState, useEffect } from "react";
import { FaFileExcel, FaTrash, FaPlay, FaPlus, FaEdit } from "react-icons/fa";
import * as XLSX from "xlsx";
import AddCompareModal from "../../components/AddCompareModal";
import clientToken from "../../../utils/ClientToken";

const DataComparison = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCompareData = async () => {
      try {
        const response = await fetch(
          "https://dwareautomator.mresult.com/api/compare/getCompare",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${clientToken}`,
            },
          }
        );

        const result = await response.json();
        console.log("✅ Backend Compare Data:", result);
        const mapped = (Array.isArray(result) ? result : []).map((item, index) => ({
          id: item.id || item.Id || item.ID || `compare-${index}`,
          ...item,
        }));
        setData(mapped);
      } catch (err) {
        console.error("❌ Failed to load compare data:", err);
      }
    };

    fetchCompareData();
  }, []);

  const handleAdd = (newEntry) => {
    setData((prev) => [...prev, { ...newEntry, id: crypto.randomUUID() }]);
  };

  const handleDelete = () => {
    setData((prev) => prev.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
  };

  const handleRun = async () => {
    try {
      if (data.length === 0) {
        alert("No data to compare.");
        return;
      }

      const response = await fetch("https://your-api-endpoint.com/api/compare/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clientToken}`,
        },
        body: JSON.stringify({ type: "data", results: data }),
      });

      const result = await response.json();
      alert(response.ok ? "✅ Comparison results saved!" : `❌ Failed: ${result.message}`);
    } catch (error) {
      console.error("❌ Error running comparison:", error);
    }
  };

  const handleExport = () => {
    if (data.length === 0) return alert("No data to export.");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DataComparison");
    XLSX.writeFile(workbook, "Data_Comparison.xlsx");
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? data.map((row) => row.id) : []);
  };

  return (
    <div className="p-4 rounded-2xl bg-gray-100 h-screen overflow-hidden">
      <h2 className="text-2xl bg-gray-200 rounded-2xl p-4 font-bold text-gray-900">
        Data Comparison
      </h2>

      <div className="flex space-x-3 mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 duration-300"
        >
          <FaPlus /> <span>Add Data Compare</span>
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
          className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 duration-300"
        >
          <FaPlay /> <span>Run</span>
        </button>
        <FaFileExcel
          onClick={handleExport}
          className="text-green-600 text-3xl cursor-pointer hover:opacity-80"
        />
      </div>

      {/* Table */}
      <div className="mt-4 bg-white shadow-lg rounded-lg overflow-x-auto">
        <div className="min-w-[1200px]">
          <table className="w-full table-auto">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left w-12">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="p-3">Action</th>
                <th className="p-3">Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Source Type</th>
                <th className="p-3">Source Type Name</th>
                <th className="p-3">Target Type</th>
                <th className="p-3">Target Type Name</th>
                <th className="p-3">Created By</th>
                <th className="p-3">Updated By</th>
                <th className="p-3">Comment</th>
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
                    <td className="p-3"><FaEdit /></td>
                    <td className="p-3">{row.name}</td>
                    <td className="p-3">{row.type}</td>
                    <td className="p-3">{row.sourceType}</td>
                    <td className="p-3">{row.sourceName}</td>
                    <td className="p-3">{row.targetType}</td>
                    <td className="p-3">{row.targetName}</td>
                    <td className="p-3">{row.createdBy}</td>
                    <td className="p-3">{row.updatedBy}</td>
                    <td className="p-3">{row.comment}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AddCompareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAdd}
      />

      {/* Pagination (Static) */}
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
