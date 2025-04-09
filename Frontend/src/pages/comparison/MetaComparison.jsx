import { useState, useEffect } from "react";
import { FaFileExcel, FaTrash, FaPlay, FaPlus, FaEdit } from "react-icons/fa";
import * as XLSX from "xlsx";
import AddMetaCompareModal from "../../components/AddMetaModal";
import clientToken from "../../../utils/ClientToken";

const MetaComparison = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);



  // Fetch from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dwareautomator.mresult.com/api/compare/GetMetaCompare", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${clientToken}`,
          },
        });

        const result = await response.json();
        if (Array.isArray(result) && result.length > 0) {
          const withIds = result.map(item => ({ ...item, id: crypto.randomUUID() }));
          setData(withIds);
          localStorage.setItem("metaComparisonData", JSON.stringify(withIds));
        } else {
          // Fallback to localStorage
          const savedData = localStorage.getItem("metaComparisonData");
          if (savedData) {
            setData(JSON.parse(savedData));
          }
        }
      } catch (error) {
        console.error("API fetch failed, trying localStorage:", error);
        const savedData = localStorage.getItem("metaComparisonData");
        if (savedData) {
          setData(JSON.parse(savedData));
        }
      }
    };

    fetchData();
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem("metaComparisonData", JSON.stringify(data));
    }
  }, [data]);

  const handleAdd = (newEntry) => {
    setData((prev) => [...prev, { ...newEntry, id: crypto.randomUUID() }]);
  };

  const handleDelete = () => {
    setData((prev) => prev.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
  };

  const handleRun = async () => {
    try {
      if (data.length === 0) return alert("No data to compare.");
      const response = await fetch("http://localhost:5000/api/comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "meta", results: data }),
      });

      const result = await response.json();
      alert(response.ok ? "Comparison results saved!" : `Failed: ${result.message}`);
    } catch (error) {
      console.error("Error running comparison:", error);
    }
  };

  const handleExport = () => {
    if (data.length === 0) return alert("No data to export.");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "metaComparison");
    XLSX.writeFile(workbook, "meta_Comparison.xlsx");
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 rounded-2xl bg-gray-100 min-h-screen">
      <h2 className="text-2xl rounded-xl p-4 bg-gray-200 font-bold text-gray-900">Meta Comparison</h2>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-4">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 duration-300">
          <FaPlus /> <span>Add Meta Compare</span>
        </button>
        <button
          onClick={handleDelete}
          disabled={selectedRows.length === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            selectedRows.length > 0 ? "bg-gray-500 hover:bg-gray-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FaTrash /> <span>Delete</span>
        </button>
        <button onClick={handleRun} className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 duration-300">
          <FaPlay /> <span>Run</span>
        </button>
        <FaFileExcel onClick={handleExport} className="text-green-600 text-3xl cursor-pointer hover:opacity-80" />
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
                  onChange={(e) => setSelectedRows(e.target.checked ? data.map((row) => row.id) : [])}
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
                <td colSpan="11" className="p-4 text-center text-gray-500">No data available</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">
                    <input type="checkbox" className="cursor-pointer" checked={selectedRows.includes(row.id)} onChange={() => handleSelectRow(row.id)} />
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

      {/* Modal */}
      <AddMetaCompareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAdd} />

      {/* Pagination */}
      <div className="flex justify-between align-middle items-center mt-4">
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
