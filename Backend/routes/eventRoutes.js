import express from "express";
import { createEvent, getEvents, updateEvent, deleteEvent } from "../controllers/eventController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createEvent); // Create Event
router.get("/", authMiddleware, getEvents); // Get Events
router.put("/:id", authMiddleware, updateEvent); // Update Event
router.delete("/:id", authMiddleware, deleteEvent); // Delete Event

export default router;
