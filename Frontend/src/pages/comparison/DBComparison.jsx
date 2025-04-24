import { useState, useEffect } from "react";
import { FaFileExcel, FaTrash, FaPlay, FaPlus, FaEdit } from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddDBCompareModal from "../../components/AddDBCompareModal";

const DBComparison = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const finalOptions = {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
    };

    const response = await fetch(url, finalOptions);

    if (response.status === 401) {
      alert("⚠️ Session expired. Please log in again.");
      localStorage.clear();
      window.location.reload();
      throw new Error("Session expired");
    }

    return response;
  };

  const fetchDBCompare = async () => {
    try {
      const res = await fetchWithAuth("https://dwareautomator.mresult.com/api/compare/GetDBCompare");
      const apiData = await res.json();

      const formatted = apiData.map((item, index) => ({
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

      setData(formatted);
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  useEffect(() => {
    fetchDBCompare();
  }, []);

  const handleAdd = (newEntry) => {
    setData((prev) => [...prev, { ...newEntry, id: crypto.randomUUID() }]);
    toast.success("✅ New DB Compare added!");
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) return;
    if (!window.confirm("Are you sure you want to delete selected DB Comparisons?")) return;

    try {
      for (const rowId of selectedRows) {
        const response = await fetchWithAuth("https://dwareautomator.mresult.com/api/compare/DeleteDBCompare", {
          method: "POST",
          body: JSON.stringify(rowId),
        });

        const result = await response.json();
        if (!response.ok) {
          toast.error(`❌ Failed to delete: ${result.message || "Unknown error"}`);
        }
      }

      toast.success("✅ Selected DB Comparisons deleted.");
      setSelectedRows([]);
      fetchDBCompare();
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  const handleRun = async () => {
    if (selectedRows.length === 0) {
      toast.warning("⚠️ Please select rows to run comparison.");
      return;
    }

    try {
      for (const rowId of selectedRows) {
        const raw = data.find((row) => row.id === rowId)?.raw;
        const payload = {
          CaseName: raw.caseName,
          CompType: raw.compType,
          SourceID: 25,
          SourceDtlID: 1,
          TargetID: 25,
          TargetDtlID: 1,
        };

        const response = await fetchWithAuth("https://dwareautomator.mresult.com/api/compare/RunDBdata", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const result = await response.json();
          toast.error(`❌ Run failed for ${raw.caseName}: ${result.message}`);
        }
      }

      toast.success("✅ DB Comparison run completed.");
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  const handleExport = () => {
    if (data.length === 0) return toast.warning("⚠️ No data to export.");

    const exportData = data.map(({ raw, id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DBComparison");
    XLSX.writeFile(workbook, "DB_Comparison.xlsx");

    toast.success("✅ Exported to Excel.");
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
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4"> DB Comparison</h2>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-5">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Add DB Compare
        </button>

        <button
          onClick={handleDelete}
          disabled={selectedRows.length === 0}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            selectedRows.length
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FaTrash /> Delete
        </button>

        <button
          onClick={handleRun}
          disabled={selectedRows.length === 0}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            selectedRows.length
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FaPlay /> Run
        </button>

        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700"
        >
          <FaFileExcel /> Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Source</th>
              <th className="px-4 py-2">Target</th>
              <th className="px-4 py-2">Created By</th>
              <th className="px-4 py-2">Updated By</th>
              <th className="px-4 py-2">Comment</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No DB Comparisons found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </td>
                  <td className="px-4 py-2 text-blue-600">
                    <FaEdit
                      className="cursor-pointer hover:text-blue-800"
                      onClick={() => toast.info(`🛠️ Edit coming soon for: ${row.name}`)}
                    />
                  </td>
                  <td className="px-4 py-2">{row.name}</td>
                  <td className="px-4 py-2">{row.type}</td>
                  <td className="px-4 py-2">{row.sourceName}</td>
                  <td className="px-4 py-2">{row.targetName}</td>
                  <td className="px-4 py-2">{row.createdBy}</td>
                  <td className="px-4 py-2">{row.updatedBy}</td>
                  <td className="px-4 py-2">{row.comment}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AddDBCompareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAdd}
        onRefresh={fetchDBCompare}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DBComparison;
