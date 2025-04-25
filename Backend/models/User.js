import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userID: { type: Number, required: true, unique: true }, // ✅ Added unique user ID
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true }, // ✅ Renamed to match API format
  password: { type: String, required: true },
  status: { type: String, default: null }, // ✅ Default changed to match expected output
  otp: { type: String, default: null }, // ✅ Added missing field
  newdata: { type: String, default: null }, // ✅ Added missing field
  refreshtoken: { type: String, default: null },
  roleDisplayName: { type: String, default: "User" }, // ✅ Added field with default role
  masterRoleID: { type: Number, default: 0 },
  activeProject: { type: Number, default: 0 },
  projects: { type: String, default: "General" }, // ✅ Changed type to match expected response
  projectName: { type: String, default: "General" },
});

export default mongoose.model("User", UserSchema);
