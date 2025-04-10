import React, { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import QueryRequestsChart from "../components/QueryRequestsChart";
import DataComparisonChart from "../components/DataComparisonChart";
import ProjectList from "../components/projectList";
import { file } from "jszip";

const ClientDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("clientToken");

  // 🔹 Example mock dashboard data
  const dashboardData = {
    queryRequests: 1,
    dataComparisons: 0,
    scheduledTasks: 0,
    queryRequestsBySources: { API: 42, Database: 55, Files: 30, Other: 15 },
    dataComparisonByType: { "Exact Match": 70, "Partial Match": 50, "No Match": 20 },
    
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch("https://dwareautomator.mresult.com/api/users/GetUserDetail", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        console.log("User detail response", data);

        // ✅ Access the first item from array
        const user = Array.isArray(data) ? data[0] : data;

        setUserDetails({
          firstName: user.firstName || "Client",
          lastName: user.lastName || "",
          email: user.emailID || "",
          role: user.roleDisplayName || "Client",
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetails();
  }, [token]);

  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div>
      {userDetails ? (
        <h1 className="text-3xl font-bold text-gray-700">
          Welcome, {userDetails.firstName} {userDetails.lastName} 
        </h1>
      ) : (
        <div className="text-gray-500 mt-4">Loading user info...</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <SummaryCard
          title="Query Requests"
          count={dashboardData.queryRequests}
          color="bg-blue-500 hover:bg-blue-700 duration-200"
        />
        <SummaryCard
          title="Data Comparisons"
          count={dashboardData.dataComparisons}
          color="bg-green-500 hover:bg-green-700 duration-200"
        />
        <SummaryCard
          title="Scheduled Tasks"
          count={dashboardData.scheduledTasks}
          color="bg-purple-500 hover:bg-purple-700 duration-200"
        />
      </div>

      <div className="mt-6 hidden">
        <ProjectList />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <QueryRequestsChart data={dashboardData.queryRequestsBySources} />
        <DataComparisonChart data={dashboardData.dataComparisonByType} />
        
      </div>
    </div>
  );
};

export default ClientDashboard;
