import { useState, useEffect } from "react";
import { FaFileAlt, FaTrash, FaFileExcel, FaEye } from "react-icons/fa";
import * as XLSX from "xlsx";

const CompareRuns = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("https://dwareautomator.mresult.com/api/RunHistory/GetData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Category: "CompareCase",
            Timezone: "all",
            StartDate: "undefined",
            EndDate: "",
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch CompareCase run data");

        const result = await response.json();

        if (Array.isArray(result)) {
          const formattedData = result.map((item) => {
            // Extract timestamp from fileName (e.g., 20240607.13.53.50)
            const fileNameMatch = item.fileName.match(/(\d{8})\.(\d{2})\.(\d{2})\.(\d{2})/);
            let formattedDate = "N/A";

            if (fileNameMatch) {
              // Format the date and time from the file name
              const [_, dateStr, hours, minutes, seconds] = fileNameMatch;
              const formattedTimestamp = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}T${hours}:${minutes}:${seconds}`;
              formattedDate = new Date(formattedTimestamp).toLocaleString();
            }

            return {
              _id: item.mst_ID || crypto.randomUUID(),
              name: item.fileName || "N/A",
              status: item.result || "Unknown",
              dateTime: formattedDate,
              runType: item.runType || "Manual",
            };
          });
          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching CompareCase runs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) return;

    const confirmDelete = window.confirm("Are you sure you want to delete the selected items?");
    if (!confirmDelete) return;

    try {
      for (const id of selectedRows) {
        await fetch(`http://localhost:5000/api/comparisons/${id}`, {
          method: "DELETE",
        });
      }

      setData((prevData) =>
        prevData.filter((row) => !selectedRows.includes(row._id))
      );
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting Data comparison runs:", error);
    }
  };

  const handleExportToXLS = () => {
    if (data.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Compare Runs");

    XLSX.writeFile(workbook, "Compare_Runs.xlsx");
  };

  const getStatusStyle = (status) => {
    const lower = status.toLowerCase();
    if (lower.includes("pass")) return "bg-green-100 text-green-700";
    if (lower.includes("fail")) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="p-6 bg-gray-100 rounded-2xl min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 bg-white px-5 py-3 rounded-xl shadow-sm">
        Results – Compare Runs
      </h2>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mt-4 mb-4">
        {["All", "Day", "Week", "Month", "Custom"].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 rounded-md bg-white shadow hover:bg-gray-100 text-sm font-medium"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-4">
        <button className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
          <FaFileAlt /> <span>Report</span>
        </button>
        <button
          onClick={handleDelete}
          disabled={selectedRows.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            selectedRows.length > 0
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FaTrash /> <span>Delete</span>
        </button>
        <button
          onClick={handleExportToXLS}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <FaFileExcel /> <span>XLS</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 uppercase text-gray-600 font-semibold">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedRows(
                      e.target.checked ? data.map((row) => row._id) : []
                    )
                  }
                  checked={selectedRows.length === data.length && data.length > 0}
                />
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Run Type</th>
              <th className="p-3 text-center">Report</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row._id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row._id)}
                      onChange={() => toggleRowSelection(row._id)}
                    />
                  </td>
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3">{row.dateTime}</td>
                  <td className="p-3">{row.runType}</td>
                  <td className="p-3 text-center">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareRuns;
