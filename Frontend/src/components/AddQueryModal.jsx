import React, { useEffect, useState } from "react";
import QueryEditorModal from "./QueryEditorModal";

const AddQueryModal = ({ isOpen, onClose, onSave, roles, editData = null }) => {
  const initialForm = {
    queryName: "",
    sourceType: "",
    function: "",
    query: "",
    createdBy: "",
    updatedBy: "",
    comment: "",
    connectionName: "",
    connectionDtlId: "",
  };

  const [form, setForm] = useState(initialForm);
  const [showQueryEditor, setShowQueryEditor] = useState(false);
  const [connectionNames, setConnectionNames] = useState([]);

  const sourceTypeToMstId = {
    SQL: 1,
    Snowflake: 3,
    SalesForce: 4,
  };

  const sourceTypeToSourceId = {
    SQL: "1",
    Snowflake: "3",
    SalesForce: "4",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "sourceType") {
      setForm((prev) => ({
        ...prev,
        [name]: value,
        connectionName: "",
        connectionDtlId: "",
      }));
    } else if (name === "connectionName") {
      const selected = connectionNames.find((conn) => conn.name === value);
      setForm((prev) => ({
        ...prev,
        [name]: value,
        connectionDtlId: selected?.dtl_ID || "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const fetchConnections = async (selectedType) => {
    const mstId = sourceTypeToMstId[selectedType];
    if (!mstId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append("Mst_ID", mstId);

      const response = await fetch(
        "https://dwareautomator.mresult.com/api/DataSource/GetConnection",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to fetch connections");

      const data = await response.json();
      const filtered = data.filter((conn) => conn.dataSourceType === selectedType);
      setConnectionNames(filtered);
    } catch (error) {
      console.error("❌ Error fetching connections:", error);
      setConnectionNames([]);
    }
  };

  const saveTestCase = async (form) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = {
        testCase_ID: editData?.testCase_ID || "TC00",
        testCaseName: form.queryName,
        Dtl_ID: form.connectionDtlId || "25",
        query: form.query,
        functionType: form.function,
        sourceID: sourceTypeToSourceId[form.sourceType] || "1",
        comments: form.comment || null,
        lastModified: null,
      };

      const response = await fetch(
        "https://dwareautomator.mresult.com/api/testCase/save",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("❌ Test case save failed");

      const result = await response.json();
      console.log("✅ Test case saved:", result);
      return result;
    } catch (error) {
      console.error("❌ Error saving test case:", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.queryName || !form.sourceType || !form.query) {
      alert("Please fill all required fields.");
      return;
    }

    await saveTestCase(form);
    onSave(form, !!editData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setForm(initialForm);
    setConnectionNames([]);
  };

  useEffect(() => {
    if (form.sourceType) {
      fetchConnections(form.sourceType);
    }
  }, [form.sourceType]);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setForm({
          queryName: editData.queryName || "",
          sourceType: editData.sourceType || "",
          function: editData.function || "",
          query: editData.query || "",
          createdBy: editData.createdBy || "",
          updatedBy: editData.updatedBy || "",
          comment: editData.comment || "",
          connectionName: editData.connectionName || "",
          connectionDtlId: editData.connectionDtlId || "",
        });
        if (editData.sourceType) {
          fetchConnections(editData.sourceType);
        }
      } else {
        resetForm();
      }
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-opacity-30 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl relative">
        <h3 className="text-xl font-bold mb-4">
          {editData ? "Edit Query" : "Add New Query"}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="queryName"
            placeholder="Query Name"
            value={form.queryName}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="sourceType"
            value={form.sourceType}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Source Type</option>
            <option value="SQL">SQL</option>
            <option value="Snowflake">Snowflake</option>
            <option value="SalesForce">SalesForce</option>
          </select>

          <select
            name="connectionName"
            value={form.connectionName}
            onChange={handleChange}
            className="border p-2 rounded"
            disabled={!connectionNames.length}
          >
            <option value="">Select Connection</option>
            {connectionNames.map((conn) => (
              <option key={conn.dtl_ID} value={conn.name}>
                {conn.name}
              </option>
            ))}
          </select>

          <select
            name="function"
            value={form.function}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Function</option>
            <option value="Count">Count</option>
            <option value="Duplicate">Duplicate</option>
            <option value="Data Validation">Data Validation</option>
            <option value="Others">Others</option>
          </select>

          <input
            type="text"
            name="createdBy"
            placeholder="Created By"
            value={form.createdBy}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="updatedBy"
            placeholder="Updated By"
            value={form.updatedBy}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-semibold mb-1 block">Query</label>
          <div
            className="border p-2 rounded bg-gray-50 cursor-pointer"
            onClick={() => setShowQueryEditor(true)}
          >
            {form.query ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {form.query}
              </pre>
            ) : (
              <span className="text-gray-500">Click to add query</span>
            )}
          </div>
        </div>

        <textarea
          name="comment"
          placeholder="Comment"
          value={form.comment}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-2"
        />

        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>

      <QueryEditorModal
        isOpen={showQueryEditor}
        onClose={() => setShowQueryEditor(false)}
        editData={form.query}
        attributes={[
          "SELECT", "FROM", "WHERE", "AND", "OR", "NOT",
          "ORDER BY", "GROUP BY", "HAVING", "JOIN",
          "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "ON", "LIMIT"
        ]}
        initialQuery={form.query}
        onSave={(newQuery) =>
          setForm((prev) => ({ ...prev, query: newQuery }))
        }
      />
    </div>
  );
};

export default AddQueryModal;
