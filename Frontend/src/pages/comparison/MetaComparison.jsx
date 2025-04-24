import { useState, useEffect } from "react";
import { FaFileExcel, FaTrash, FaPlay, FaPlus, FaEdit, FaUpload } from "react-icons/fa";
import * as XLSX from "xlsx";
import AddMetaCompareModal from "../../components/AddMetaModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MetaComparison = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTokenFromLocalStorage = () => localStorage.getItem("token");

  const fetchMetaCompareData = async () => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.warn("No token found in localStorage.");
        return;
      }

      const response = await fetch("https://dwareautomator.mresult.com/api/compare/GetMetaCompare", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (Array.isArray(result) && result.length > 0) {
        const mapped = result.map((item, index) => ({
          id: item.id,
          dtlID: item.id,
          name: item.caseName,
          type: "Meta",
          sourceType: "SQL",
          sourceName: item.srcDtlName,
          sourceTable: item.sourceTable || "N/A",
          targetType: "SQL",
          targetName: item.trgDtlName,
          targetTable: item.targetTable || "N/A",
          createdBy: item.createdBy,
          updatedBy: item.lastUpdatedBy,
          comment: item.comments ?? "",
        }));

        setData(mapped);
        localStorage.setItem("metaComparisonData", JSON.stringify(mapped));
      } else {
        const saved = localStorage.getItem("metaComparisonData");
        if (saved) setData(JSON.parse(saved));
      }
    } catch (error) {
      console.error("API fetch failed. Using localStorage backup.", error);
      const saved = localStorage.getItem("metaComparisonData");
      if (saved) setData(JSON.parse(saved));
    }
  };

  useEffect(() => {
    fetchMetaCompareData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem("metaComparisonData", JSON.stringify(data));
    }
  }, [data]);

  const handleAdd = (newEntry) => {
    setData((prev) => [...prev, { ...newEntry, id: crypto.randomUUID() }]);
    toast.success("Meta comparison added successfully!");
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) return;

    const confirmDelete = window.confirm("Are you sure you want to delete the selected Meta Comparisons?");
    if (!confirmDelete) return;

    try {
      const token = getTokenFromLocalStorage();
      if (!token) return;

      for (let rowId of selectedRows) {
        const selected = data.find((row) => row.id === rowId);
        if (!selected) {
          console.warn(`No data found for id ${rowId}`);
          continue;
        }

        const { dtlID, name } = selected;

        if (!dtlID) {
          console.error(`❌ Missing dtlID for ${name}. Skipping deletion.`);
          continue;
        }

        const response = await fetch("https://dwareautomator.mresult.com/api/compare/DeleteMetaCompare", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/plain, */*",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(rowId)
        });

        const result = await response.json();

        if (!response.ok) {
          console.error(`❌ Failed to delete ${name}:`, result.message || "Unknown error");
          toast.error(`❌ Failed to delete ${name}: ${result.message || "Unknown error"}`);
        } else {
          console.log(`✅ Deleted ${name}`);
          toast.success(`✅ Deleted ${name}`);
        }
      }

      setSelectedRows([]);
      fetchMetaCompareData(); // Refresh after deletion
    } catch (error) {
      console.error("Error deleting Meta comparisons:", error.message);
      toast.error("❌ Error deleting Meta comparisons.");
    }
  };

  const handleRun = async () => {
    try {
      if (selectedRows.length === 0) {
        toast.warn("Please select at least one comparison to run.");
        return;
      }

      const token = getTokenFromLocalStorage();
      if (!token) {
        toast.error("No token found.");
        return;
      }

      // Loop through each selected item and call RunMetadata
      for (const rowId of selectedRows) {
        const selected = data.find(row => row.id === rowId);
        if (!selected) continue;

        const payload = {
          Id: selected.dtlID,             // real backend ID
          CaseName: selected.name         // what backend expects
        };

        const response = await fetch("https://dwareautomator.mresult.com/api/compare/RunMetadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const result = await response.text(); // it's returning a filename string, not JSON

        if (response.ok) {
          console.log(`✅ Run complete for ${payload.CaseName}: ${result}`);
          toast.success(`✅ Result file: ${result}`);
        } else {
          console.error(`❌ Failed to run for ${payload.CaseName}:`, result);
          toast.error(`❌ Failed to run ${payload.CaseName}`);
        }
      }
    } catch (error) {
      console.error("Error running meta comparison:", error);
      toast.error("An error occurred while running the comparison.");
    }
  };

  const handleExport = () => {
    if (data.length === 0) return toast.warn("No data to export.");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "metaComparison");
    XLSX.writeFile(workbook, "meta_Comparison.xlsx");
    toast.success("✅ Exported to Excel successfully!");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length > 0) {
        setData(jsonData); // Assuming the data format from Excel matches your structure
        toast.success("✅ Imported data successfully!");
      } else {
        toast.error("❌ No data found in the Excel file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow-inner">
    <h2 className="text-3xl font-semibold text-gray-800 mb-6"> Meta Comparison</h2>
  
    {/* Action Buttons */}
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
      >
        <FaPlus /> Add Meta Compare
      </button>
  
      <button
        onClick={handleDelete}
        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
      >
        <FaTrash />Delete
      </button>
  
      <button
        onClick={handleRun}
        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition"
      >
        <FaPlay /> Run
      </button>
  
      <button
        onClick={handleExport}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
      >
        <FaFileExcel /> Export
      </button>
  
      <label
        htmlFor="file-upload"
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer"
      >
        <FaFileExcel /> Import
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".xlsx,.xls"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  
    {/* Data Table */}
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-200 text-gray-700 text-left">
          <tr>
            <th className="p-3">
              <input
                type="checkbox"
                className="cursor-pointer"
                onChange={(e) => setSelectedRows(e.target.checked ? data.map((row) => row.id) : [])}
                checked={selectedRows.length === data.length && data.length > 0}
              />
            </th>
            <th className="p-3">Action</th>
            <th className="p-3">Name</th>
            <th className="p-3">Type</th>
            <th className="p-3">Source Type</th>
            <th className="p-3">Source Name</th>
            <th className="p-3">Source Table</th>
            <th className="p-3">Target Type</th>
            <th className="p-3">Target Name</th>
            <th className="p-3">Target Table</th>
            <th className="p-3">Created By</th>
            <th className="p-3">Updated By</th>
            <th className="p-3">Comment</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="13" className="text-center text-gray-500 p-6">No data available</td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                    className="cursor-pointer"
                  />
                </td>
                <td className="p-3 text-blue-600 hover:text-blue-800 cursor-pointer"><FaEdit /></td>
                <td className="p-3">{row.name}</td>
                <td className="p-3">{row.type}</td>
                <td className="p-3">{row.sourceType}</td>
                <td className="p-3">{row.sourceName}</td>
                <td className="p-3">{row.sourceTable}</td>
                <td className="p-3">{row.targetType}</td>
                <td className="p-3">{row.targetName}</td>
                <td className="p-3">{row.targetTable}</td>
                <td className="p-3">{row.createdBy}</td>
                <td className="p-3">{row.updatedBy}</td>
                <td className="p-3">{row.comment}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

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
  
    {/* Modal */}
    <AddMetaCompareModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onAdd={handleAdd}
    />
  
    {/* Toasts */}
    <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
  </div>
  
  );
};

export default MetaComparison;
