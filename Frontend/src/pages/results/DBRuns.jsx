import { useState, useEffect } from "react";
import { FaFileAlt, FaTrash, FaFileExcel, FaEye } from "react-icons/fa";
import * as XLSX from "xlsx"; // Fix XLSX import

const DBRuns = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]); // For selected rows

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/comparisons/type/db");
        if (!response.ok) throw new Error("Failed to fetch data");
  
        const result = await response.json();
        console.log("Fetched Data:", result); // ✅ Debug API Response
  
        if (Array.isArray(result)) {
          const formattedData = result.map((item) => ({
            _id: item._id,
            name: item.results?.[0]?.name || "N/A", // ✅ Get name from results array
            dateTime: item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A", // ✅ Format dateTime
            status: item.status || "Success",
            runType: item.type || "Manual",
          }));
  
          setData(formattedData);
          console.log("Formatted Data:", formattedData); // ✅ Debug Processed Data
        } else {
          console.error("Unexpected API response format:", result);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching DB comparison runs:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  // ✅ Handle row selection
  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // ✅ Handle delete functionality
  const handleDelete = async () => {
    if (selectedRows.length === 0) return;

    const confirmDelete = window.confirm("Are you sure you want to delete the selected items?");
    if (!confirmDelete) return;

    try {
      for (const id of selectedRows) {
        await fetch(`http://localhost:5000/api/comparisons/${id}`, { method: "DELETE" });
      }

      setData((prevData) => prevData.filter((row) => !selectedRows.includes(row._id)));
      setSelectedRows([]); // Clear selection
    } catch (error) {
      console.error("Error deleting DB comparison runs:", error);
    }
  };

  // ✅ Handle Export to XLS
  const handleExportToXLS = () => {
    if (data.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DB Runs");

    XLSX.writeFile(workbook, "DB_Runs.xlsx");
  };

  return (
    <div className="p-6 rounded-2xl bg-gray-100 min-h-screen">
      <h2 className="text-2xl bg-gray-200 p-4 rounded-2xl font-bold text-gray-900">Results – DB Runs</h2>

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
        <button onClick={handleExportToXLS} className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          <FaFileExcel /> <span>XLS</span>
        </button>
      </div>

      {/* Table */}
      <div className="mt-6  bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => setSelectedRows(e.target.checked ? data.map((row) => row._id) : [])}
                  checked={selectedRows.length === data.length && data.length > 0}
                />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date and Time</th>
              
              <th className="p-3 text-left">Run Type</th>
              <th className="p-3 text-center">View Report</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const dateObj = row.dateTime ? new Date(row.dateTime) : null;
                const formattedDate = dateObj ? dateObj.toLocaleDateString() : "N/A";
                const formattedTime = dateObj ? dateObj.toLocaleTimeString() : "N/A";

                return (
                  <tr key={row._id} className="border-t hover:bg-gray-100 transition">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row._id)}
                        onChange={() => toggleRowSelection(row._id)}
                      />
                    </td>
                    <td className="p-3">{row.name}</td>
                    <td className="p-3">{row.status}</td>
                    <td className="p-3">{row.dateTime}</td>
                    
                    <td className="p-3">Manual</td>
                    <td className="p-3 text-center">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                        <FaEye /> 
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DBRuns;
