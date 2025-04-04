import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  userID: { type: Number, required: true },
  mst_ID: { type: Number, required: true },
  dtl_ID: { type: Number, required: true },
  dataSourceType: { type: String, required: true },
  fileLocation: { type: String, default: null },
  sheetName: { type: String, default: null },
  name: { type: String, required: true },
  userName: { type: String },
  password: { type: String },
  connectionType: { type: String },
  hostname: { type: String },
  port: { type: Number, default: null },
  databaseName: { type: String },
  connectionString: { type: String, default: null },
  type: { type: String, default: null },
});

const Connection = mongoose.model("Connection", connectionSchema);
export default Connection;
