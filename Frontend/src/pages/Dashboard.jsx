import React, { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import QueryRequestsChart from "../components/QueryRequestsChart";
import DataComparisonChart from "../components/DataComparisonChart";
import ProjectList from "../components/projectList"; // 🔥 Import ProjectList

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await fetch("http://localhost:5000/api/getUserDetails", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user details");
        }

        const data = await response.json();
        console.log("User Data:", data); // 🔥 Debugging

        setUserDetails({
          firstName: data.name?.split(" ")[0] || "User",
          lastName: data.name?.split(" ")[1] || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err.message);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized access. Please log in.");

        const response = await fetch("http://localhost:5000/api/dashboard", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      }
    };

    const fetchData = async () => {
      await fetchUserDetails();
      await fetchDashboardData();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-700">Dashboard</h1>
      

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <SummaryCard
          title="Query Requests"
          count={dashboardData?.queryRequests || 0}
          color="bg-blue-500 hover:bg-blue-700 duration-200"
        />
        <SummaryCard
          title="Data Comparisons"
          count={dashboardData?.dataComparisons || 0}
          color="bg-green-500 hover:bg-green-700 duration-200"
        />
        <SummaryCard
          title="Scheduled Tasks"
          count={dashboardData?.scheduledTasks || 0}
          color="bg-purple-500 hover:bg-purple-700 duration-200"
        />
      </div>

      {/* 🔥 Show Project List */}
      <div className="mt-6 hidden">
        <ProjectList />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {dashboardData?.queryRequestsBySources && (
          <QueryRequestsChart data={dashboardData.queryRequestsBySources} />
        )}
        {dashboardData?.dataComparisonByType && (
          <DataComparisonChart data={dashboardData.dataComparisonByType} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
