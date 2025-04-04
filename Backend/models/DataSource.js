import mongoose from "mongoose";

const dataSourceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  icon: { type: String, required: true },
  isUploaded: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  orderID: { type: Number, default: 0 },
  list_ID: { type: Number, required: true },
  isTestActive: { type: Boolean, default: false },
});

const DataSource = mongoose.model("DataSource", dataSourceSchema);
export default DataSource;
