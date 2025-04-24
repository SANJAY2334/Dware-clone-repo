import express from "express";
import Project from "../models/project.js"; // Mongoose Model
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all projects for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ userID: req.user.id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add a new project
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { projectID, project_Name, status } = req.body;
    const newProject = new Project({ projectID, project_Name, status, userID: req.user.id });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: "Error creating project" });
  }
});

// ✅ Edit project details
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.userID.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    Object.assign(project, req.body);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error updating project" });
  }
});

// ✅ Delete a project
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.userID.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project" });
  }
});

export default router;
