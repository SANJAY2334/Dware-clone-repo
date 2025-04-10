import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      status: "Y",
      refreshtoken: null,
      masterRoleID: 0,
      activeProject: 0,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.roleDisplayName, // 👈 Add this line
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // **Structured Response**
    res.status(200).json({
      user: [
        {
          userID: user._id,
          emailID: user.email,
          password: null, // 🔹 Always null for security
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          status: user.status || "Y",
          otp: null,
          newdata: null,
          refreshtoken: token,
          roleDisplayName: null,
          projects: user.projects || null,
          masterRoleID: user.masterRoleID || 0,
          activeProject: user.activeProject || 0,
          projectName: user.projectName || null,
        },
      ],
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
