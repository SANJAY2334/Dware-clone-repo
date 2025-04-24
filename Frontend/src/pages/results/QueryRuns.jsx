import { useEffect, useState } from "react";
import { FaFileExcel, FaTrash, FaFileAlt } from "react-icons/fa";
import axios from "axios";

const QueryRuns = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token not found. Please login first.");
          return;
        }

        const payload = {
          Category: "MetaComparecase",
          Timezone: "all",
          StartDate: "undefined",
          EndDate: ""
        };

        const response = await axios.post(
          "https://dwareautomator.mresult.com/api/RunHistory/GetData",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.data && Array.isArray(response.data)) {
          const formattedData = response.data.map((item, index) => ({
            id: item.mst_ID,
            name: item.fileName?.split("#")[1] || `Query #${index + 1}`,
            status: item.result,
            dateTime: item.fileName?.split("_")[1]?.replaceAll(".", ":") || "N/A",
            runType: item.runType,
            executedBy: item.executedBy,
            filePath: item.filePath
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    setData(data.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    if (status === "Success") return `${base} bg-green-100 text-green-700`;
    if (status === "Failed") return `${base} bg-red-100 text-red-700`;
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Results – Query Requests</h2>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4">
        {["All", "Day", "Week", "Month", "Custom"].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 rounded-lg text-sm bg-white border hover:bg-blue-100 transition"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-5">
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          <FaFileAlt /> <span>Report</span>
        </button>
        <button
          onClick={handleDelete}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
            selectedRows.length > 0
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={selectedRows.length === 0}
        >
          <FaTrash /> <span>Delete</span>
        </button>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
          <FaFileExcel /> <span>XLS</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
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
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date & Time</th>
              <th className="p-3 text-left">Run Type</th>
              <th className="p-3 text-left">Executed By</th>
              <th className="p-3 text-center">Report</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 p-5">
                  No data available.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="border-t hover:bg-gray-50 transition text-sm"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      className="accent-blue-600"
                    />
                  </td>
                  <td className="p-3 font-medium">{row.name}</td>
                  <td className="p-4">
                    <span className={getStatusBadge(row.status)}>{row.status}</span>
                  </td>
                  <td className="p-3">{row.dateTime}</td>
                  <td className="p-3">{row.runType}</td>
                  <td className="p-3">{row.executedBy}</td>
                  <td className="p-3 text-center">
                    <a
                      href={`https://dwareautomator.mresult.com${row.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-md transition"
                    >
                      View Report
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
        <p className="text-gray-600 text-sm">
          Showing {data.length === 0 ? 0 : 1} to {data.length} of {data.length} entries
        </p>
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <button className="px-3 py-1 border rounded-md hover:bg-gray-200">«</button>
          <button className="px-3 py-1 border bg-blue-500 text-white rounded-md">
            1
          </button>
          <button className="px-3 py-1 border rounded-md hover:bg-gray-200">»</button>
          <select className="border p-1 rounded-md text-sm bg-white">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default QueryRuns;
