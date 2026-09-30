const Application = require("../models/Application");
const Consent = require("../models/Consent");
const AuditLog = require("../models/AuditLog");
const { v4: uuidv4 } = require("uuid");

exports.submitApplication = async (req, res) => {
  const { serviceName, primaryDepartment, formData, requiresDataFrom } = req.body;
  
  try {
    const trackingId = uuidv4();
    
    // Create Application
    const application = new Application({
      citizenId: req.user.id,
      serviceName,
      primaryDepartment,
      trackingId,
      formData,
      timeline: [{ status: "Submitted", department: primaryDepartment, notes: "Application received." }]
    });

    await application.save();

    await AuditLog.create({
      action: "APPLICATION_SUBMITTED",
      actor: req.user.id,
      resource: application._id,
      details: { serviceName, trackingId }
    });

    // Simulate cross-department request
    if (requiresDataFrom) {
      const consent = new Consent({
        citizenId: req.user.id,
        requestingDepartment: primaryDepartment,
        providingDepartment: requiresDataFrom,
        dataRequested: ["IdentityDetails", "IncomeDetails"], // Mock data needs
      });
      await consent.save();
      
      application.timeline.push({
        status: "Pending Consent",
        department: primaryDepartment,
        notes: `Awaiting citizen consent to fetch data from ${requiresDataFrom}`
      });
      application.status = "Pending Consent";
      await application.save();
    }

    res.status(201).json(application);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.getApplications = async (req, res) => {
  try {
    // If official, maybe return all, if citizen, only theirs
    const query = req.user.role === "citizen" ? { citizenId: req.user.id } : {};
    const applications = await Application.find(query).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
