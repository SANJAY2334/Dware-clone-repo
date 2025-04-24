import express from "express";
import ComparisonResult from "../models/ComparisonResult.js";

const router = express.Router();

// ✅ Save a new comparison result
router.post("/", async (req, res) => {
  try {
    const { type, results } = req.body;

    if (!type || !results) {
      return res.status(400).json({ message: "Type and results are required" });
    }

    const newResult = new ComparisonResult({ type, results });
    await newResult.save();

    res.status(201).json({ message: "Comparison result saved", data: newResult });
  } catch (error) {
    res.status(500).json({ message: "Error saving comparison result", error });
  }
});

// ✅ Get all comparison results (for Results page)
router.get("/", async (req, res) => {
  try {
    const results = await ComparisonResult.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results", error });
  }
});

// ✅ Get specific type of comparison results (Placed before DELETE to avoid conflicts)
router.get("/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const results = await ComparisonResult.find({ type }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results", error });
  }
});

// ✅ Delete a comparison result by ID (Placed after GET /type to avoid conflicts)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedResult = await ComparisonResult.findByIdAndDelete(id);

    if (!deletedResult) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json({ message: "Comparison result deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comparison result", error });
  }
});

export default router;
