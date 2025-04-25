import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  projectID: { type: Number, required: true },
  project_Name: { type: String, required: true },
  status: { type: Boolean, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Project", ProjectSchema);
