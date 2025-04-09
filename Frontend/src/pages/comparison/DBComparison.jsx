import { useState, useEffect } from "react";
import { FaFileExcel, FaTrash, FaPlay, FaPlus, FaEdit } from "react-icons/fa";
import * as XLSX from "xlsx";
import AddDBCompareModal from "../../components/AddDBCompareModal";
import clientToken from "../../../utils/ClientToken";

const DBComparison = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDBCompare = async () => {
    try {
      const response = await fetch("https://dwareautomator.mresult.com/api/compare/GetDBCompare", {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          Authorization: `Bearer ${clientToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch DB Compare");

      const apiData = await response.json();

      const formattedData = apiData.map((item, index) => ({
        id: item.id || `row-${index}`,
        name: item.caseName || "—",
        type: item.compType || "—",
        sourceType: "SQL",
        sourceName: item.srcDtlName || "—",
        targetType: "SQL",
        targetName: item.trgDtlName || "—",
        createdBy: item.createdBy || "—",
        updatedBy: item.lastUpdatedBy || "—",
        comment: item.comments || "—",
        raw: item,
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching DB comparison data:", error.message);
    }
  };

  useEffect(() => {
    fetchDBCompare();
  }, []);

  const handleAdd = (newEntry) => {
    setData((prevData) => [...prevData, { ...newEntry, id: crypto.randomUUID() }]);
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) return;

    const confirmDelete = window.confirm("Are you sure you want to delete the selected DB Comparisons?");
    if (!confirmDelete) return;

    try {
      for (let rowId of selectedRows) {
        const selected = data.find((row) => row.id === rowId);
        const raw = selected.raw;

        const response = await fetch("https://dwareautomator.mresult.com/api/compare/DeleteDBCompare", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/plain, */*",
            Authorization: `Bearer ${clientToken}`,
          },
          body: JSON.stringify(rowId),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error(`❌ Failed to delete ${raw.caseName}:`, result.message || "Unknown error");
        } else {
          console.log(`✅ Deleted ${raw.caseName}`);
        }
      }

      alert("✅ Selected DB Comparisons deleted.");
      setSelectedRows([]);
      fetchDBCompare();
    } catch (error) {
      console.error("Error deleting DB comparisons:", error.message);
      alert("❌ Error deleting DB comparisons.");
    }
  };

  const handleRun = async () => {
    try {
      if (selectedRows.length === 0) {
        alert("Please select at least one row to run the comparison.");
        return;
      }

      for (let rowId of selectedRows) {
        const selected = data.find((row) => row.id === rowId);
        const raw = selected.raw;

        const payload = {
          CaseName: raw.caseName,
          CompType: raw.compType,
          SourceID: 25,
          SourceDtlID: 1,
          TargetID: 25,
          TargetDtlID: 1,
        };

        const response = await fetch("https://dwareautomator.mresult.com/api/compare/RunDBdata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/plain, */*",
            Authorization: `Bearer ${clientToken}`,
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error(`❌ Failed for ${raw.caseName}:`, result.message || "Unknown error");
        } else {
          console.log(`✅ Run successful for ${raw.caseName}:`, result);
        }
      }

      alert("✅ DB Comparison run completed for all selected rows.");
    } catch (error) {
      console.error("Error running DB comparisons:", error);
      alert("❌ Error running DB comparisons.");
    }
  };

  const handleExport = () => {
    if (data.length === 0) {
      alert("No data to export.");
      return;
    }

    const exportData = data.map(({ id, raw, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DBComparison");
    XLSX.writeFile(workbook, "DB_Comparison.xlsx");
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(data.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-gray-100 min-h-screen">
      <h2 className="text-2xl bg-gray-200 rounded-xl font-bold p-4 text-gray-900">DB Comparison</h2>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 duration-300"
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
          disabled={selectedRows.length === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            selectedRows.length > 0
              ? "bg-gray-500 hover:bg-gray-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FaPlay /> <span>Run</span>
        </button>
        <FaFileExcel
          onClick={handleExport}
          className="text-green-600 text-3xl cursor-pointer hover:opacity-80"
        />
      </div>

      {/* Table */}
      <div className="mt-4 bg-white shadow-lg rounded-lg overflow-x-auto max-w-full max-h-[500px]">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="p-3 w-12 bg-gray-200">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-3 bg-gray-200">Action</th>
              <th className="p-3 bg-gray-200">Name</th>
              <th className="p-3 bg-gray-200">Type</th>
              <th className="p-3 bg-gray-200">Source Type</th>
              <th className="p-3 bg-gray-200">Source Name</th>
              <th className="p-3 bg-gray-200">Target Type</th>
              <th className="p-3 bg-gray-200">Target Name</th>
              <th className="p-3 bg-gray-200">Created By</th>
              <th className="p-3 bg-gray-200">Updated By</th>
              <th className="p-3 bg-gray-200">Comment</th>
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
                <tr key={row.id} className="border-t hover:bg-gray-100 align-top">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </td>
                  <td className="p-3">
                    <FaEdit className="cursor-pointer" onClick={() => console.log("Edit row:", row)} />
                  </td>
                  <td className="p-3 max-w-[150px] break-words">{row.name}</td>
                  <td className="p-3 max-w-[150px] break-words">{row.type}</td>
                  <td className="p-3">{row.sourceType}</td>
                  <td className="p-3 max-w-[150px] break-words">{row.sourceName}</td>
                  <td className="p-3">{row.targetType}</td>
                  <td className="p-3 max-w-[150px] break-words">{row.targetName}</td>
                  <td className="p-3">{row.createdBy}</td>
                  <td className="p-3">{row.updatedBy}</td>
                  <td className="p-3 max-w-[200px] break-words">{row.comment}</td>
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
        onSave={handleAdd}
        onRefresh={fetchDBCompare}
      />

      {/* Pagination (Placeholder) */}
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

export default DBComparison;
