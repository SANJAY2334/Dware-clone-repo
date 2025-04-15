import React, { useState, useEffect } from "react";
import {
  FaPlay,
  FaTrash,
  FaPlus,
  FaClipboardList,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddQueryModal from "../components/AddQueryModal";
import DataSource from "../components/DataSource";
import ProjectList from "../components/projectList";
import clientToken from "../../utils/ClientToken";

const QueryDesigner = () => {
  const [queryResult, setQueryResult] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    try {
      const response = await fetch(
        "https://dwareautomator.mresult.com/api/Admin/GetRoles?ProjectID=0",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${clientToken}`,
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
      const response = await fetch(
        "https://dwareautomator.mresult.com/api/TestCase/GetTestCase",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${clientToken}`,
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

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedRows.length} selected quer${
        selectedRows.length > 1 ? "ies" : "y"
      }?`
    );
    if (!confirmDelete) return;

    try {
      for (const id of selectedRows) {
        const response = await fetch(
          "https://dwareautomator.mresult.com/api/testCase/delete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${clientToken}`,
            },
            body: JSON.stringify(id),
          }
        );
        if (!response.ok) throw new Error(`Failed to delete query with ID: ${id}`);
      }

      setQueryResult((prev) => prev.filter((row) => !selectedRows.includes(row.id)));
      setSelectedRows([]);
      setSelectAll(false);
      toast.success("Selected queries deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete one or more queries.");
    }
  };

  const runSelectedQueries = async () => {
    if (selectedRows.length === 0) {
      toast.info("Please select at least one query to run.");
      return;
    }

    try {
      for (const id of selectedRows) {
        const row = queryResult.find((q) => q.id === id);
        if (!row) continue;

        const payload = {
          sourceID: row.sourceID,
          Dtl_ID: row.Dtl_ID,
          ID: row.ID,
          taskIndex: row.taskIndex,
        };

        const response = await fetch(
          "https://dwareautomator.mresult.com/api/testCase/run",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${clientToken}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const result = await response.json();
        if (response.ok) {
          console.log(`✅ Query ID ${id} ran successfully:`, result);
        } else {
          console.warn(`⚠️ Failed to run Query ID ${id}:`, result);
        }
      }

      toast.success("Selected queries executed!");
    } catch (err) {
      toast.error("Something went wrong while running the queries.");
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchTestCases();
  }, []);

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
// check queryResult length
console.log("Query Result Length:", queryResult.length);

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-2xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-gray-200 rounded-2xl  mb-4 ">
      <h2 className="text-2xl bg-gray-200 rounded-xl font-bold p-4 text-gray-900">Query Designer</h2>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-4">
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Add Query
        </button>
        <button
          className="flex items-center px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
          onClick={deleteSelectedQueries}
        >
          <FaTrash className="mr-2" /> Delete
        </button>
        <button
          className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          onClick={runSelectedQueries}
        >
          <FaPlay className="mr-2" /> Run
        </button>
        <button className="flex items-center px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition">
          <FaClipboardList className="mr-2" /> Query Analysis
        </button>
      </div>

      {/* Query Table */}
      <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
        <h3 className="text-lg font-bold text-gray-700">Query Results</h3>
        {loading ? (
          <p className="text-gray-500 mt-2">Loading queries...</p>
        ) : queryResult.length > 0 ? (
          <table className="mt-4 w-full text-sm text-left border-collapse rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3">Name</th>
                <th className="p-3">Source Type</th>
                <th className="p-3">Function</th>
                <th className="p-3">Query</th>
                <th className="p-3">Created By</th>
                <th className="p-3">Updated By</th>
              </tr>
            </thead>
            <tbody>
              {queryResult.map((row, index) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-100 ${
                    index === queryResult.length - 1 ? "rounded-b-lg" : ""
                  }`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                    />
                  </td>
                  <td className="p-3">{row.queryName}</td>
                  <td className="p-3">{row.sourceType}</td>
                  <td className="p-3">{row.function}</td>
                  <td className="p-3 truncate max-w-xs" title={row.query}>
                    {row.query.length > 50 ? `${row.query.slice(0, 50)}...` : row.query}
                  </td>
                  <td className="p-3">{row.createdBy}</td>
                  <td className="p-3">{row.updatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 mt-2">No results to display.</p>
        )}
      </div>

      {/* Hidden components */}
      <div className="hidden">
        <DataSource roles={roles} />
        <ProjectList />
      </div>

      {/* Add Query Modal */}
      <AddQueryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddQuery}
        roles={roles}
        initialData={null}
      />
    </div>
  );
};

export default QueryDesigner;
