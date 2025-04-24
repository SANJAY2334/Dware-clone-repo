import React, { useState, useEffect } from "react";
import {
  FaPlay,
  FaTrash,
  FaPlus,
  FaClipboardList,
  FaEdit,
  FaFileExcel,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddQueryModal from "../components/AddQueryModal";
import QueryAnalysisModal from "../components/QueryAnalysisModal";

const QueryDesigner = () => {
  const [queryResult, setQueryResult] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchTestCases();
  }, []);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const response = await fetch(
        "https://dwareautomator.mresult.com/api/Admin/GetRoles?ProjectID=0",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch roles");
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      toast.error(`Error fetching roles: ${err.message}`);
    }
  };

  const fetchTestCases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        "https://dwareautomator.mresult.com/api/TestCase/GetTestCase",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch test cases");
      const data = await response.json();

      const sourceTypeMap = {
        1: "SQL",
        2: "Oracle",
        3: "Snowflake",
        4: "SalesForce",
        5: "PostgreSQL",
        6: "MySQL",
      };

      const mappedData = data.map((test, index) => ({
        id: test.id || index + 1,
        queryName: test.testCaseName || "N/A",
        sourceType: test.sourceType || sourceTypeMap[test.sourceID] || "N/A",
        function: test.functionType || "N/A",
        query: test.query || "N/A",
        createdBy: test.createdBy || "N/A",
        updatedBy: test.lastUpdatedBy || "N/A",
        sourceID: test.sourceID || 0,
        Dtl_ID: test.dtl_ID || 0,
        ID: test.id || 0,
        taskIndex: 0,
      }));

      setQueryResult(mappedData);
    } catch (err) {
      toast.error(`Error fetching test cases: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteSelectedQueries = async () => {
    if (selectedRows.length === 0) {
      toast.info("Please select at least one query to delete.");
      return;
    }

    if (!window.confirm(`Delete ${selectedRows.length} selected queries?`))
      return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      for (const id of selectedRows) {
        const response = await fetch(
          "https://dwareautomator.mresult.com/api/testCase/delete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(id),
          }
        );
        if (!response.ok) throw new Error(`Failed to delete query ID: ${id}`);
      }

      setQueryResult((prev) =>
        prev.filter((row) => !selectedRows.includes(row.id))
      );
      setSelectedRows([]);
      setSelectAll(false);
      toast.success("Queries deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete queries.");
    }
  };

  const runSelectedQueries = async () => {
    if (selectedRows.length === 0) {
      toast.info("Please select queries to run.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      for (const id of selectedRows) {
        const row = queryResult.find((q) => q.id === id);
        if (!row) continue;

        const payload = {
          sourceID: row.sourceID,
          Dtl_ID: row.Dtl_ID,
          ID: row.ID,
          taskIndex: row.taskIndex,
        };

        await fetch("https://dwareautomator.mresult.com/api/testCase/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      toast.success("Queries executed!");
    } catch (err) {
      toast.error("Error running queries.");
    }
  };

  const analyzeQuery = async () => {
    if (selectedRows.length !== 1) {
      toast.info("Please select exactly one query to analyze.");
      return;
    }

    const selectedId = selectedRows[0];
    const selectedQuery = queryResult.find((q) => q.id === selectedId);
    if (!selectedQuery) {
      toast.error("Selected query not found.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        "https://dwareautomator.mresult.com/api/testCase/AnalyzeData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedId),
        }
      );

      if (!response.ok) throw new Error("Failed to analyze query");

      const result = await response.json();
      setAnalysisResult(result);
      setIsAnalysisModalOpen(true);
      toast.success("Query analyzed successfully!");
    } catch (err) {
      toast.error(`Error analyzing query: ${err.message}`);
    }
  };

  const handleAddQuery = (newQuery) => {
    const newId = queryResult.length
      ? Math.max(...queryResult.map((q) => q.id)) + 1
      : 1;
    setQueryResult((prev) => [...prev, { ...newQuery, id: newId }]);
    setIsModalOpen(false);
  };

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(!selectAll ? queryResult.map((row) => row.id) : []);
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
      const data = XLSX.utils.sheet_to_json(ws);
      const imported = data.map((item, index) => ({
        id: Date.now() + index,
        queryName: item.queryName || "N/A",
        sourceType: item.sourceType || "N/A",
        function: item.function || "N/A",
        query: item.query || "N/A",
        createdBy: item.createdBy || "N/A",
        updatedBy: item.updatedBy || "N/A",
      }));
      setQueryResult([...queryResult, ...imported]);
      toast.success("Queries imported successfully!");
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    const data = queryResult.map((row) => ({
      queryName: row.queryName,
      sourceType: row.sourceType,
      function: row.function,
      query: row.query,
      createdBy: row.createdBy,
      updatedBy: row.updatedBy,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Queries");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(dataBlob, "QueryResults.xlsx");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-2xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800">Query Designer</h2>
        <div className="space-x-3 flex overflow-x-auto">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
            <FaPlus className="mr-2" /> Add Query
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700" onClick={deleteSelectedQueries}>
            <FaTrash className="mr-2" /> Delete
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700" onClick={analyzeQuery}>
            <FaClipboardList className="mr-2" /> Query Analysis
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={runSelectedQueries}>
            <FaPlay className="mr-2" /> Run
          </button>
          <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700">
            <FaFileExcel className="mr-2" /> Import
            <input type="file" accept=".xlsx" hidden onChange={handleImport} />
          </label>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={handleExport}>
            <FaFileExcel className="mr-2" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Query Results</h3>
        {loading ? (
          <p>Loading queries...</p>
        ) : queryResult.length > 0 ? (
          <table className="w-full table-auto">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="p-3 w-12">
                  <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                </th>
                <th className="p-3">Action</th>
                <th className="p-3">Name</th>
                <th className="p-3">Source Type</th>
                <th className="p-3">Function</th>
                <th className="p-3">Query</th>
                <th className="p-3">Created By</th>
                <th className="p-3">Updated By</th>
              </tr>
            </thead>
            <tbody>
              {queryResult.map((row) => (
                <tr key={row.id} className="boder-t hover:bg-gray-100">
                  <td className="p-2 text-center">
                    <input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => toggleRowSelection(row.id)} />
                  </td>
                  <td className="p-3"><FaEdit /></td>
                  <td className="p-3">{row.queryName}</td>
                  <td className="p-3">{row.sourceType}</td>
                  <td className="p-3">{row.function}</td>
                  <td className="p-3 truncate max-w-xs" title={row.query}>
                    {row.query.length > 50 ? row.query.slice(0, 50) + "..." : row.query}
                  </td>
                  <td className="p-3">{row.createdBy}</td>
                  <td className="p-3">{row.updatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available</p>
        )}
      </div>

      <AddQueryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddQuery} />

      <QueryAnalysisModal isOpen={isAnalysisModalOpen} onClose={() => setIsAnalysisModalOpen(false)} analysisResult={analysisResult} />
    </div>
  );
};

export default QueryDesigner;
