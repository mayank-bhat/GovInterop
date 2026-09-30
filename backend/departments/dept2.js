const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const AuditLog = require("../models/AuditLog");
const axios = require("axios");
const auth = require("../middleware/auth");

// Department 2: Education (Requires Income Data for Scholarship)

router.post("/process/:applicationId", auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Simulate fetching data from Dept 1
    // We pass the JWT token to authenticate as the gateway/user
    const config = {
      headers: { Authorization: req.header("Authorization") }
    };

    const host = req.get('host');
    const response = await axios.get(`http://${host}/api/dept1/data/${req.body.nationalId}?requestingDepartment=Education`, config);

    const incomeData = response.data;

    // Process logic
    let newStatus = "Approved";
    if (incomeData.annualIncome > 800000) {
      newStatus = "Rejected";
    }

    application.status = newStatus;
    application.timeline.push({
      status: newStatus,
      department: "Education",
      notes: `Data fetched from Revenue Dept. Income Verified: ${incomeData.verified}.`
    });

    await application.save();

    await AuditLog.create({
      action: "APPLICATION_PROCESSED",
      actor: "Education",
      resource: application._id,
      details: { finalStatus: newStatus }
    });

    res.json(application);
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 403) {
        return res.status(403).json({ message: "Failed to process due to missing consent from Revenue Dept." });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
