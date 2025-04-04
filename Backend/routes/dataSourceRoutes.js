import express from "express";
import DataSource from "../models/DataSource.js";

const router = express.Router();

// ✅ Get All Data Sources
router.get("/", async (req, res) => {
  try {
    const dataSources = await DataSource.find();
    res.status(200).json(dataSources);
  } catch (error) {
    console.error("❌ Error fetching data sources:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
