const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "DATA_ACCESS", "CONSENT_GRANTED"
  actor: { type: String }, // User ID or Department Name
  resource: { type: String }, // e.g., Application ID, Consent ID
  details: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);
