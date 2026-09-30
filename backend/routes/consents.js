const express = require("express");
const router = express.Router();
const consentController = require("../controllers/consentController");
const auth = require("../middleware/auth");

router.post("/", auth, consentController.requestConsent);
router.get("/", auth, consentController.getConsents);
router.put("/:id", auth, consentController.updateConsent);

module.exports = router;
