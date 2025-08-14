// routes/clockRoutes.js
const express = require("express");
const router = express.Router();
const clockController = require("../controllers/clockController");
const authMiddleware = require("../middleware/authMiddleware"); // your auth middleware

router.post("/clock-in", authMiddleware, clockController.clockIn);
router.post("/clock-out", authMiddleware, clockController.clockOut);

module.exports = router;
