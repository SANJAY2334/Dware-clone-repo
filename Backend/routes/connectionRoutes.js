import express from "express";
import {
  getConnections,
  createConnection
} from "../controllers/connectionController.js";

const router = express.Router();

router.get("/", getConnections);
router.post("/", createConnection);

export default router;
