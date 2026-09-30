const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceName: { type: String, required: true }, // e.g., "Driving License"
  primaryDepartment: { type: String, required: true },
  status: { type: String, default: "Submitted" },
  trackingId: { type: String, required: true, unique: true },
  timeline: [
    {
      status: String,
      department: String,
      timestamp: { type: Date, default: Date.now },
      notes: String
    }
  ],
  formData: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model("Application", ApplicationSchema);
