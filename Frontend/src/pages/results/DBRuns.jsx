import { useState, useEffect } from "react";
import { FaFileExcel, FaTrash, FaEye } from "react-icons/fa";
import * as XLSX from "xlsx";

const DBRuns = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchRunsData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://dwareautomator.mresult.com/api/RunHistory/GetData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Category: "DBComparecase",
            Timezone: "all",
            StartDate: "undefined",
            EndDate: "",
          }),
        }
      );

      const text = await response.text();
      const result = text ? JSON.parse(text) : [];

      const formatted = Array.isArray(result)
        ? result.map((item) => {
            const fileNameParts = item.fileName?.split("_");
            const rawTimestamp = fileNameParts?.[1]?.replace(".json", "");

            let formattedDate = "N/A";
            if (rawTimestamp) {
              const parts = rawTimestamp.split(".");
              if (parts.length === 6) {
                const [year, month, day, hour, minute, second] = parts;
                const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
                const dateObj = new Date(isoString);
                if (!isNaN(dateObj)) {
                  formattedDate = dateObj.toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }
              }
            }

            return {
              _id: item.mst_ID || "N/A",
              name: item.fileName || "N/A",
              status: item.result || "N/A",
              executedBy: item.executedBy || "N/A",
              dateTime: formattedDate,
              runType: item.runType || "Manual",
              filePath: item.filePath || "",
            };
          })
        : [];

      setData(formatted);
    } catch (error) {
      console.error("❌ Error fetching DB Run History:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRunsData();
  }, []);

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) return;
    const confirmDelete = window.confirm("Are you sure you want to delete the selected items?");
    if (!confirmDelete) return;

    try {
      for (const id of selectedRows) {
        await fetch(`http://localhost:5000/api/comparisons/${id}`, { method: "DELETE" });
      }
      setData((prevData) => prevData.filter((row) => !selectedRows.includes(row._id)));
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting DB comparison runs:", error);
    }
  };

  const handleExportToXLS = () => {
    if (data.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DB Runs");
    XLSX.writeFile(workbook, "DB_Runs.xlsx");
  };

  const getStatusStyle = (status) => {
    const lower = status.toLowerCase();
    if (lower.includes("pass")) return "bg-green-100 text-green-700";
    if (lower.includes("fail")) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">DB Compare Runs</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              selectedRows.length > 0
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={selectedRows.length === 0}
          >
            <FaTrash /> Delete
          </button>
          <button
            onClick={handleExportToXLS}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <FaFileExcel /> Export XLS
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead className="bg-gray-100 text-sm font-semibold text-left">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedRows(e.target.checked ? data.map((row) => row._id) : [])
                  }
                  checked={selectedRows.length === data.length && data.length > 0}
                />
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">Executed By</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Run Type</th>
              <th className="p-3 text-center">Report</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-5 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-5 text-center text-gray-500">
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row._id)}
                      onChange={() => toggleRowSelection(row._id)}
                    />
                  </td>
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{row.executedBy}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3">{row.dateTime}</td>
                  <td className="p-3">{row.runType}</td>
                  <td className="p-3 text-center">
                    <a
                      href={`https://dwareautomator.mresult.com${row.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <FaEye />
                    </a>
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

export default DBRuns;
