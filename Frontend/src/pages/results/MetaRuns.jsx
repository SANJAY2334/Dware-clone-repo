import { useState, useEffect } from "react";
import { FaFileAlt, FaTrash, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import clientToken from "../../../utils/ClientToken";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const MetaRuns = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://dwareautomator.mresult.com/api/RunHistory/GetData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${clientToken}`,
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
        console.log("Fetched MetaRuns:", result);

        const formattedData = result.map((item) => ({
          _id: item.mst_ID || Math.random().toString(),
          name: item.fileName || "N/A",
          executedBy: item.executedBy || "N/A",
          dateTime: item.fileName?.split("_")?.[1]?.replace(/\./g, ":") || "N/A",
          status: item.result || "Unknown",
          runType: item.runType || "N/A",
          filePath: item.filePath || "",
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching Meta comparison runs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        await fetch(`https://dwareautomator.mresult.com/api/comparisons/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${clientToken}`,
          },
        });
      }

      setData((prevData) => prevData.filter((row) => !selectedRows.includes(row._id)));
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting Meta comparison runs:", error);
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

  return (
    <div className="p-6 rounded-2xl bg-gray-100 min-h-screen">
      <h2 className="text-2xl bg-gray-200 rounded-2xl p-4 font-bold text-gray-900">Results – Meta Runs</h2>

      <div className="flex space-x-2 mt-4">
        {["All", "Day", "Week", "Month", "Custom"].map((filter) => (
          <button key={filter} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition">
            {filter}
          </button>
        ))}
      </div>

      <div className="flex justify-end space-x-3 mt-5">
        <button className="flex items-center space-x-2 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">
          <FaFileAlt /> <span>Download All</span>
        </button>
        <button
          onClick={handleDelete}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            selectedRows.length > 0
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={selectedRows.length === 0}
        >
          <FaTrash /> <span>Delete</span>
        </button>
        <button
          onClick={handleExportToXLS}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <FaFileExcel /> <span>XLS</span>
        </button>
      </div>

      <div className="mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedRows(e.target.checked ? data.map((row) => row._id) : [])
                  }
                  checked={selectedRows.length === data.length && data.length > 0}
                />
              </th>
              <th className="p-3 text-left">Executed By</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Run Type</th>
              <th className="p-3 text-left">Date & Time</th>
              <th className="p-3 text-center">Download</th>
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
              data.map((row) => (
                <tr key={row._id} className="border-t hover:bg-gray-100 transition">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row._id)}
                      onChange={() => toggleRowSelection(row._id)}
                    />
                  </td>
                  <td className="p-3">{row.executedBy}</td>
                  <td className="p-3">{row.status}</td>
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
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 inline-flex items-center"
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
