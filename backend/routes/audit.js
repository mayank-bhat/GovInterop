const express = require("express");
const router = express.Router();
const AuditLog = require("../models/AuditLog");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  if (req.user.role !== "official") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
