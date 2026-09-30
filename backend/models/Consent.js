const mongoose = require("mongoose");

const ConsentSchema = new mongoose.Schema({
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  requestingDepartment: { type: String, required: true }, // e.g., "Transport"
  providingDepartment: { type: String, required: true }, // e.g., "Revenue"
  dataRequested: [{ type: String }], // e.g., ["IncomeCertificate", "Address"]
  status: { type: String, enum: ["pending", "approved", "rejected", "revoked"], default: "pending" },
  validUntil: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Consent", ConsentSchema);
