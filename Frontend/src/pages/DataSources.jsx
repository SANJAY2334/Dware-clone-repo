import React from "react";
import DataSourceCard from "../components/DataSourceCard";

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

const DataSources = () => {
  return (
    <div className="p-10 bg-gray-50 min-h-screen rounded-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6"> Data Sources</h2>

      {/* Database Section */}
      <div className="bg-blue-100 shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4"> Databases</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {databases.map((db, index) => (
            <DataSourceCard key={index} {...db} />
          ))}
        </div>
      </div>

      {/* Flat Files Section */}
      <div className="bg-blue-100 shadow-lg rounded-lg p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4"> Flat Files</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {flatFiles.map((file, index) => (
            <DataSourceCard key={index} {...file} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataSources;
