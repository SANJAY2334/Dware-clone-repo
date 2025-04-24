import { useState, useEffect, useRef } from "react";
import {
  FaFileExcel,
  FaTrash,
  FaPlay,
  FaPlus,
  FaEdit,
  FaClipboardList,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import AddCompareModal from "../../components/AddCompareModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DataComparison = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCompareData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://dwareautomator.mresult.com/api/compare/getCompare",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();

        const mapped = Array.isArray(result)
          ? result.map((item, index) => ({
              id: item.id || item.ID || `compare-${index}`,
              name: item.caseName || `Compare-${index}`,
              type: "Data",
              sourceType: "SQL",
              sourceName: item.srcDtlName || "N/A",
              targetType: "SQL",
              targetName: item.trgDtlName || "N/A",
              createdBy: item.createdBy || "Unknown",
              updatedBy: item.lastUpdatedBy || "—",
              comment: item.comments || "",
              raw: item,
            }))
          : [];

        setData(mapped);
      } catch (err) {
        console.error("❌ Failed to load compare data:", err);
        toast.error("❌ Failed to load compare data!");
      }
    };

    fetchCompareData();
  }, []);

  const handleAdd = (newEntry) => {
    setData((prev) => [...prev, { ...newEntry, id: crypto.randomUUID() }]);
    toast.success("✅ Query added successfully!");
  };

  const handleDelete = () => {
    setData((prev) => prev.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
    toast.success("✅ Selected entries deleted!");
  };

  const handleRun = async () => {
    try {
      if (data.length === 0) return toast.warning("❌ No data to compare.");

      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://your-api-endpoint.com/api/compare/run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type: "data", results: data }),
        }
      );

      const result = await response.json();
      toast.success(
        response.ok ? "✅ Comparison results saved!" : `❌ Failed: ${result.message}`
      );
    } catch (error) {
      console.error("❌ Error running comparison:", error);
      toast.error("❌ Error running comparison!");
    }
  };

  const handleExport = () => {
    if (data.length === 0) return toast.warning("❌ No data to export.");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DataComparison");
    XLSX.writeFile(workbook, "Data_Comparison.xlsx");
    toast.success("✅ Data exported successfully!");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const imported = XLSX.utils.sheet_to_json(ws);
      setData((prev) => [
        ...prev,
        ...imported.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
        })),
      ]);
      toast.success("✅ Data imported successfully!");
    };
    reader.readAsBinaryString(file);
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
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
    <div className="p-6 rounded-2xl bg-white h-full overflow-auto shadow-md">
    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Data Comparison</h2>
  
    {/* Action Buttons */}
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        onClick={() => setIsModalOpen(true)}
      >
        <FaPlus className="mr-2" /> Add Query
      </button>
  
      <button
        className="flex items-center px-5 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition"
        onClick={handleDelete}
      >
        <FaTrash className="mr-2" /> Delete
      </button>
  
      <button
        className="flex items-center px-5 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition"
        onClick={handleRun}
      >
        <FaPlay className="mr-2" /> Run
      </button>
  
      <button
        className="flex items-center px-5 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
        onClick={handleExport}
      >
        <FaFileExcel className="mr-2" /> Export
      </button>
  
      <button
        className="flex items-center px-5 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
        onClick={triggerImport}
      >
        <FaFileExcel className="mr-2" /> Import
      </button>
  
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  
    {/* Table Section */}
    <div className="bg-gray-50 shadow-inner rounded-xl overflow-auto">
      <table className="min-w-full text-sm text-left text-gray-800">
        <thead className="bg-gray-200 text-gray-700 text-xs uppercase">
          <tr>
            <th className="p-4">
              <input
                type="checkbox"
                checked={selectedRows.length === data.length && data.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="cursor-pointer"
              />
            </th>
            <th className="p-4">Action</th>
            <th className="p-4">Name</th>
            <th className="p-4">Type</th>
            <th className="p-4">Source Type</th>
            <th className="p-4">Source Name</th>
            <th className="p-4">Target Type</th>
            <th className="p-4">Target Name</th>
            <th className="p-4">Created By</th>
            <th className="p-4">Updated By</th>
            <th className="p-4">Comment</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="11" className="text-center text-gray-500 p-6">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                className="border-t hover:bg-gray-100 transition-colors"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                  />
                </td>
                <td className="p-4">
                  <FaEdit className="cursor-pointer text-gray-600 hover:text-blue-500" />
                </td>
                <td className="p-4">{row.name}</td>
                <td className="p-4">{row.type}</td>
                <td className="p-4">{row.sourceType}</td>
                <td className="p-4">{row.sourceName}</td>
                <td className="p-4">{row.targetType}</td>
                <td className="p-4">{row.targetName}</td>
                <td className="p-4">{row.createdBy}</td>
                <td className="p-4">{row.updatedBy}</td>
                <td className="p-4">{row.comment}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  
    {/* Pagination */}
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
      <p className="text-sm text-gray-600">
        Showing {data.length === 0 ? 0 : 1} to {data.length} of {data.length} entries
      </p>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 border rounded-md hover:bg-gray-100">«</button>
        <button className="px-3 py-1 border bg-blue-600 text-white rounded-md">1</button>
        <button className="px-3 py-1 border rounded-md hover:bg-gray-100">»</button>
        <select className="border p-1 rounded-md">
          <option>10</option>
          <option>20</option>
          <option>50</option>
        </select>
      </div>
    </div>
  
    {/* Modal & Toast */}
    <AddCompareModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSave={handleAdd}
    />
    <ToastContainer />
  </div>
  
  );
};

export default DataComparison;
