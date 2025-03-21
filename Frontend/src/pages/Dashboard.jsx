import React, { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import QueryRequestsChart from "../components/QueryRequestsChart";
import DataComparisonChart from "../components/DataComparisonChart";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  if (!dashboardData) {
    return <div className="text-center text-gray-600 mt-10">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-700">Dashboard</h1>
      <p className="text-gray-500">Welcome to your dashboard.</p>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <SummaryCard title="Query Requests" count={dashboardData.queryRequests} color="bg-blue-500 hover:bg-blue-700 duration-200" />
        <SummaryCard title="Data Comparisons" count={dashboardData.dataComparisons} color="bg-green-500 hover:bg-green-700 duration-200" />
        <SummaryCard title="Scheduled Tasks" count={dashboardData.scheduledTasks} color="bg-purple-500 hover:bg-purple-700 duration-200" />
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <QueryRequestsChart data={dashboardData.queryRequestsBySources} />
        <DataComparisonChart data={dashboardData.dataComparisonByType} />
      </div>
    </div>
  );
};

export default Dashboard;
