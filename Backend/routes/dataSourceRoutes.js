import express from "express";
import DataSource from "../models/DataSource.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ GET all data sources
router.get("/getDS", verifyToken, async (req, res) => {
  try {
    const dataSources = await DataSource.find();

    const formattedData = dataSources.map(({ id, name, type, icon, isUploaded, isActive, orderID, list_ID, isTestActive }) => ({
      id, name, type, icon, isUploaded, isActive, orderID, list_ID, isTestActive,
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data sources", error });
  }
});

// ✅ POST (Create a new Data Source)
router.post("/createDS", verifyToken, async (req, res) => {
  try {
    const { id, name, type, icon, isUploaded, isActive, orderID, list_ID, isTestActive } = req.body;

    const newDataSource = new DataSource({
      id, name, type, icon, isUploaded, isActive, orderID, list_ID, isTestActive,
    });

    await newDataSource.save();
    res.status(201).json({ message: "Data source created successfully", data: newDataSource });
  } catch (error) {
    res.status(500).json({ message: "Error creating data source", error });
  }
});

export default router;
