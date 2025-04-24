import { useState, useEffect } from "react";
import { FaFileAlt, FaTrash, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const MetaRuns = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const token = localStorage.getItem("token");
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://dwareautomator.mresult.com/api/RunHistory/GetData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Category: "MetaComparecase",
            Timezone: "all",
            StartDate: "undefined",
            EndDate: "",
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();

        const formattedData = result.map((item) => {
          // Extract date from the fileName
          const extractedDate = item.fileName
            ? item.fileName.match(/(\d{4})\.(\d{2})\.(\d{2})\.(\d{2})\.(\d{2})\.(\d{2})/) // Regex to extract date and time from filename
            : null;

          const formattedDate = extractedDate
            ? new Date(
                `${extractedDate[1]}-${extractedDate[2]}-${extractedDate[3]}T${extractedDate[4]}:${extractedDate[5]}:${extractedDate[6]}`
              ).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "medium",
              })
            : "N/A";

          return {
            _id: item.mst_ID || Math.random().toString(),
            name: item.fileName || "N/A",
            executedBy: item.executedBy || "N/A",
            dateTime: item.createdDate
              ? new Date(item.createdDate).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                })
              : formattedDate, // Use extracted date if createdDate is not available
            status: item.result || "Unknown",
            runType: item.runType || "N/A",
            filePath: item.filePath || "",
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching Meta comparison runs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

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
        await fetch(`https://dwareautomator.mresult.com/api/comparisons/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setData((prevData) => prevData.filter((row) => !selectedRows.includes(row._id)));
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting runs:", error);
    }
  };

  const handleExportToXLS = () => {
    if (data.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Meta Runs");
    XLSX.writeFile(workbook, "Meta_Runs.xlsx");
  };

  const handleDownloadZip = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("File not found");
      const blob = await response.blob();
      const zip = new JSZip();
      zip.file(`${fileName}.xlsx`, blob);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${fileName}.zip`);
    } catch (error) {
      console.error("Error downloading ZIP:", error);
      alert("Failed to download file.");
    }
  };

  const getStatusStyle = (status) => {
    const lower = status.toLowerCase();
    if (lower.includes("pass")) return "bg-green-100 text-green-700";
    if (lower.includes("fail")) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Results – Meta Compare Runs</h2>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex space-x-2">
          {["All", "Day", "Week", "Month", "Custom"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 text-sm rounded-md ${
                selectedFilter === filter ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              } font-medium text-gray-700`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex space-x-3">
          <button className="flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300">
            <FaFileAlt /> Download All
          </button>
          <button
            onClick={handleDelete}
            disabled={selectedRows.length === 0}
            className={`flex items-center gap-2 px-3 py-2 rounded ${
              selectedRows.length > 0
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaTrash /> Delete
          </button>
          <button
            onClick={handleExportToXLS}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
          >
            <FaFileExcel /> Export XLS
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={(e) =>
                    setSelectedRows(e.target.checked ? data.map((row) => row._id) : [])
                  }
                />
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">Executed By</th>
              <th className="p-3">Status</th>
              <th className="p-3">Run Type</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
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
                  <td className="p-3">{row.executedBy}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyle(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3">{row.runType}</td>
                  <td className="p-3">{row.dateTime}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        handleDownloadZip(
                          `https://dwareautomator.mresult.com${row.filePath}`,
                          row.name.replace(".xlsx", "")
                        )
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 inline-flex items-center"
                    >
                      <FaFileAlt className="mr-1" /> Download
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

export default MetaRuns;
