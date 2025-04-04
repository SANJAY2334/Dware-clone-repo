import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Protected Route: Get User Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.user.userID }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: [
        {
          userID: user.userID, // ✅ Corrected user ID field
          emailID: user.email,
          password: null,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status || "Y",
          otp: null,
          newdata: null,
          refreshtoken: null,
          roleDisplayName: user.roleDisplayName || "User", // ✅ Fixed missing defaults
          projects: user.projects || "General", // ✅ Fixed missing defaults
          masterRoleID: user.masterRoleID || 0,
          activeProject: user.activeProject || 0,
          projectName: user.projectName || "General", // ✅ Fixed missing defaults
        },
      ],
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
