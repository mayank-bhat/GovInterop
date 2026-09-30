const Consent = require("../models/Consent");
const AuditLog = require("../models/AuditLog");

exports.requestConsent = async (req, res) => {
  const { requestingDepartment, providingDepartment, dataRequested } = req.body;
  try {
    const consent = new Consent({
      citizenId: req.user.id,
      requestingDepartment,
      providingDepartment,
      dataRequested
    });
    await consent.save();

    await AuditLog.create({
      action: "CONSENT_REQUESTED",
      actor: requestingDepartment,
      resource: consent._id,
      details: { dataRequested }
    });

    res.status(201).json(consent);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.getConsents = async (req, res) => {
  try {
    const consents = await Consent.find({ citizenId: req.user.id }).sort({ createdAt: -1 });
    res.json(consents);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.updateConsent = async (req, res) => {
  try {
    const consent = await Consent.findById(req.params.id);
    if (!consent) return res.status(404).json({ message: "Consent not found" });
    if (consent.citizenId.toString() !== req.user.id) return res.status(401).json({ message: "Not authorized" });

    consent.status = req.body.status;
    await consent.save();

    await AuditLog.create({
      action: `CONSENT_${req.body.status.toUpperCase()}`,
      actor: req.user.id,
      resource: consent._id,
      details: { status: consent.status }
    });

    res.json(consent);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
