const express = require("express");
const router = express.Router();
const gatewayController = require("../controllers/gatewayController");
const auth = require("../middleware/auth");

router.post("/", auth, gatewayController.submitApplication);
router.get("/", auth, gatewayController.getApplications);
router.get("/:id", auth, gatewayController.getApplicationById);

module.exports = router;
