import React, { useState, useEffect } from "react";
import DataSourceCard from "../components/DataSourceCard";
import DataSource from "../components/DataSource";
import ProjectList from "../components/projectList";
import AddNewConnection from "../components/AddNewConnection";
import clientToken from "../../utils/ClientToken";


const DataSources = () => {
  const [UserDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState("");

  const databases = [
    { name: "SQL", icon: "/icons/sql.png", isEditable: true },
    { name: "Oracle", icon: "/icons/oracle.png" },
    { name: "Snowflake", icon: "/icons/snowflake.png", isEditable: true },
    { name: "Salesforce", icon: "/icons/salesforce.png", isEditable: true },
    { name: "Teradata", icon: "/icons/teradata.png" },
    { name: "Amazon Redshift", icon: "/icons/redshift.png" },
    { name: "PostgreSQL", icon: "/icons/postgresql.png" },
    { name: "MySQL", icon: "/icons/mysql.png" },
  ];

  const flatFiles = [
    { name: "XLSX", icon: "/icons/xlsx.png", isUploadable: true },
    { name: "CSV", icon: "/icons/csv.png", isUploadable: true },
    { name: "XML", icon: "/icons/xml.png", isUploadable: true },
    { name: "JSON", icon: "/icons/json.png", isUploadable: true },
  ];

  // ✅ Fetch User Details
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch("http://localhost:5000/api/getUserDetails", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user details");

      const userData = await response.json();
      setUserDetails(userData.user);
    } catch (err) {
      console.error("❌ Error fetching user details:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchRoles = async () => {
    try {
      const response = await fetch(
        "https://dwareautomator.mresult.com/api/Admin/GetRoles?ProjectID=0",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${clientToken}`,
          }
        }
      );

      if (!response.ok) throw new Error("Failed to fetch roles");
      const data = await response.json();
      console.log("✅ Roles fetched:", data);
      setRoles(data);
    } catch (err) {
      console.error("❌ Error fetching roles:", err.message);
    }
  };

  // ✅ Fetch data when component mounts
  useEffect(() => {
    fetchUserDetails();
    fetchRoles();
  }, []);

  

  // ✅ Handle Database Click
  const handleDatabaseClick = (dbName) => {
    setSelectedDataSource(dbName); // Set selected database
    setShowModal(true);
     // Show modal
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen rounded-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Data Sources</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <>
          {/* ✅ Database Section */}
          <div className="bg-blue-100 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Databases</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {databases.map((db, index) => (
                <button key={index} onClick={() => handleDatabaseClick(db.name)}>
                  <DataSourceCard {...db} />
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Flat Files Section */}
          <div className="bg-blue-100 shadow-lg rounded-lg p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Flat Files</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {flatFiles.map((file, index) => (
                <DataSourceCard key={index} {...file} />
              ))}
            </div>

            {/* ✅ Additional Components */}
            <div className="mt-6 hidden">
              <DataSource />
            </div>

            <div className="mt-6 hidden">
              <ProjectList />
            </div>
          </div>
        </>
      )}

      {/* ✅ Show AddNewConnection Modal when triggered */}
      {showModal && (
        <AddNewConnection
          onClose={() => setShowModal(false)}
          preSelectedDataSource={selectedDataSource}
        />
      )}
    </div>
  );
};

export default DataSources;
