import Connection from "../models/connectionModel.js";

// GET all connections
export const getConnections = async (req, res) => {
  try {
    const connections = await Connection.find();
    res.status(200).json(connections);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch connections" });
  }
};

// POST new connection
export const createConnection = async (req, res) => {
  try {
    const newConnection = new Connection(req.body);
    await newConnection.save();
    res.status(201).json(newConnection);
  } catch (err) {
    res.status(400).json({ error: "Failed to create connection" });
  }
};
