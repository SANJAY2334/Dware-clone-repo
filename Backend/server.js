import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express(); // ✅ Define 'app' before using it

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // Change this to match your frontend URL
    credentials: true,
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/api/dashboard", (req, res) => {
    res.json({
      queryRequests: 120,
      dataComparisons: 85,
      scheduledTasks: 40,
      queryRequestsBySources: { API: 42, Database: 55, Files: 30, Other: 15 },
      dataComparisonByType: { "Exact Match": 70, "Partial Match": 50, "No Match": 20 },
    });
});

// Middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("🔥 MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
