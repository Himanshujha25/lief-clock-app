const express = require("express");
const router = express.Router();
const managerController = require("../controllers/managerController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const User = require("../models/User");

// Only managers can access these routes
router.use(authMiddleware);
router.use(roleMiddleware("manager"));

// Set user location
router.post("/set-location", managerController.setLocation);

// Permit or restrict user access
router.post("/set-permission", managerController.setUserPermission);

// Get all users (optionally filter by role)
router.get("/users", managerController.getAllActiveWorkers);

// Get attendance logs for users
router.get("/attendance", managerController.getAttendanceLogs);

router.get("/overview", managerController.getOverview);

// routes/manager.js
router.delete("/workers/:email", authMiddleware, async (req, res) => {
  try {
    const { email } = req.params;
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.json({ message: "Worker removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error removing worker", error: err });
  }
});


module.exports = router;
