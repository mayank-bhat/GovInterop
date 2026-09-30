const express = require("express");
const router = express.Router();
const AuditLog = require("../models/AuditLog");
const Consent = require("../models/Consent");
const auth = require("../middleware/auth");

// Department 1: Revenue (Holds Income Data)

router.get("/data/:nationalId", auth, async (req, res) => {
  // Check if consent exists
  const consent = await Consent.findOne({
    status: "approved",
    providingDepartment: "Revenue",
    requestingDepartment: req.query.requestingDepartment // Passed by Dept2
  });

  if (!consent && req.user.role !== "official") {
    // Audit unauthorized access attempt
    await AuditLog.create({
      action: "DATA_ACCESS_DENIED",
      actor: req.query.requestingDepartment || "Unknown",
      resource: `RevenueData_${req.params.nationalId}`,
      details: "No active consent found"
    });
    return res.status(403).json({ message: "No active consent to access this data." });
  }

  // Log successful access
  await AuditLog.create({
    action: "DATA_ACCESSED",
    actor: req.query.requestingDepartment || "Unknown",
    resource: `RevenueData_${req.params.nationalId}`,
    details: "Income details shared"
  });

  // Return mock data
  res.json({
    nationalId: req.params.nationalId,
    annualIncome: 500000,
    currency: "INR",
    verified: true
  });
});

module.exports = router;
