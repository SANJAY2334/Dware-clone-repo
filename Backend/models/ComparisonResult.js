import mongoose from "mongoose";

const ComparisonResultSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["data", "meta", "db"] }, // Type of comparison
  results: { type: Object, required: true }, // Store comparison results
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

export default mongoose.model("ComparisonResult", ComparisonResultSchema);
