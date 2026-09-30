require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// In-memory mock departments
const dept1Router = require("./departments/dept1");
const dept2Router = require("./departments/dept2");

app.use("/api/dept1", dept1Router);
app.use("/api/dept2", dept2Router);

// Central Interoperability Layer
const authRoutes = require("./routes/auth");
const consentRoutes = require("./routes/consents");
const applicationRoutes = require("./routes/applications");
const auditRoutes = require("./routes/audit");

app.use("/api/auth", authRoutes);
app.use("/api/consents", consentRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/audit", auditRoutes);

app.get("/", (req, res) => res.send("Government Interoperability API Running"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/gov-interop")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
