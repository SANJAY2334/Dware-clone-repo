import { useState } from "react";

const AddNewConnection = ({ onClose, preSelectedDataSource }) => {
  const [formData, setFormData] = useState({
    name: "",
    dataSourceType: preSelectedDataSource || "",
    connectionType: "",
    userName: "",
    password: "",
    hostname: "",
    port: "",
    databaseName: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token"); // ✅ Get token from localStorage

    const payload = {
      userID: 8,
      mst_ID: 2,
      dtl_ID: 1,
      dataSourceType: formData.dataSourceType,
      fileLocation: null,
      sheetName: null,
      name: formData.name,
      userName: formData.userName,
      password: formData.password,
      connectionType: formData.connectionType,
      hostname: formData.hostname,
      port: formData.port || null,
      databaseName: formData.databaseName,
      connectionString: null,
      type: null,
    };

    try {
      const res = await fetch("https://dwareautomator.mresult.com/api/DataSource/SaveConnection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save connection");

      const data = await res.json();
      console.log("✅ Connection saved:", data);
      onClose(); // Close modal
    } catch (err) {
      console.error("❌ Error submitting form:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-opacity-30 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Connection</h2>
          <button onClick={onClose} className="text-gray-500 text-lg">✖</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="text" name="dataSourceType" readOnly value={formData.dataSourceType} className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed" />
          <input type="text" name="connectionType" placeholder="Connection Type" required value={formData.connectionType} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="text" name="userName" placeholder="Username" required value={formData.userName} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="text" name="hostname" placeholder="Host" required value={formData.hostname} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="number" name="port" placeholder="Port" value={formData.port} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="text" name="databaseName" placeholder="Database Name" required value={formData.databaseName} onChange={handleChange} className="w-full border p-2 rounded" />

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded" disabled={loading}>Cancel</button>
            <button type="submit" className={`px-4 py-2 text-white rounded ${loading ? "bg-blue-300" : "bg-blue-500"}`} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewConnection;
