import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DataSources from "./pages/DataSources";
import QueryDesigner from "./pages/QueryDesigner";
import Scheduler from "./pages/Scheduler";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// ✅ Import New Comparison Pages
import DataComparison from "./pages/comparison/DataComparison";
import MetaComparison from "./pages/comparison/MetaComparison";
import DBComparison from "./pages/comparison/DBComparison";

// ✅ Import New Results Pages
import QueryRuns from "./pages/results/QueryRuns";
import CompareRuns from "./pages/results/CompareRuns";
import MetaRuns from "./pages/results/MetaRuns";
import DBRuns from "./pages/results/DBRuns"; // Renamed for consistency



const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 🔹 Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔹 Protected Routes with Layout */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} /> {/* Default route */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="data-sources" element={<DataSources />} />
            <Route path="query-designer" element={<QueryDesigner />} />
            <Route path="scheduler" element={<Scheduler />} />

            {/* 🔹 Comparison Pages */}
            <Route path="comparison/data" element={<DataComparison />} />
            <Route path="comparison/meta" element={<MetaComparison />} />
            <Route path="comparison/db" element={<DBComparison />} />

            {/* 🔹 Results Pages */}
            <Route path="results/query-runs" element={<QueryRuns />} />
            <Route path="results/compare-runs" element={<CompareRuns />} />
            <Route path="results/meta-runs" element={<MetaRuns />} />
            <Route path="results/db-runs" element={<DBRuns />} /> {/* Renamed */}
          </Route>

          
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
