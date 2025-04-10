import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import comparisonRoutes from "./routes/comparisonRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import User from "./models/User.js"; // ✅ Import User Model
import eventRoutes from "./routes/eventRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import dataSourceRoutes from "./routes/dataSourceRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";



dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Update this if your frontend URL changes
    credentials: true,
  })
);

// ✅ Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    console.log("Decoded Token:", decoded); // 🔍 Debugging
    req.user = decoded; // ✅ Use `id`, not `_id`
    next();
  });
};

// ✅ Get User Details Route (Requires Authentication)
app.get("/api/getUserDetails", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching user with ID:", req.user.id); // 🔍 Debugging
    if (!req.user.id) return res.status(400).json({ message: "Invalid token data" });

    const user = await User.findById(req.user.id).select("-password"); // ✅ FIX: Use `id`, not `_id`

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user: {  // ✅ Wrap user data inside "user" object
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        status: user.status || "Y",
        roleDisplayName: user.roleDisplayName || "User",
        projects: user.projects || "General",
        masterRoleID: user.masterRoleID || 0,
        activeProject: user.activeProject || 0,
        projectName: user.projectName || "General",
        refreshtoken: user.refreshtoken || null,
        otp: null,
        newdata: null,
        password: null, // 🔒 Always null for security
        
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Dashboard Route (Protected)
app.get("/api/dashboard", authenticateToken, (req, res) => {
  res.json({
    queryRequests: 120,
    dataComparisons: 85,
    scheduledTasks: 40,
    queryRequestsBySources: { API: 42, Database: 55, Files: 30, Other: 15 },
    dataComparisonByType: { "Exact Match": 70, "Partial Match": 50, "No Match": 20 },
  });
});
app.get("/api/client-dashboard", authenticateToken, (req, res) => {
  res.json({
    queryRequests: 120,
    dataComparisons: 85,
    scheduledTasks: 40,
    queryRequestsBySources: { API: 42, Database: 55, Files: 30, Other: 15 },
    dataComparisonByType: { "Exact Match": 70, "Partial Match": 50, "No Match": 20 },
  });
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comparisons", comparisonRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dataSource", dataSourceRoutes);

app.use("/api/getConnection", connectionRoutes); // 👈 Mount route


// ✅ Middleware
app.use(errorHandler);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("🔥 MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
