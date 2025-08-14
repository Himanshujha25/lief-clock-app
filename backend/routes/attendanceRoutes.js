// routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const attendanceController = require("../controllers/attendanceControllers");

// Worker route - only own attendance
router.get("/my-attendance", authMiddleware, roleMiddleware("worker"), attendanceController.getOwnAttendance);

// Manager routes
router.get("/manager/workers", authMiddleware, roleMiddleware("manager"), attendanceController.getWorkerAttendance);
// router.get("/manager/attendance-by-email", authMiddleware, roleMiddleware("manager"), attendanceController.getAttendanceByEmail);

module.exports = router;
