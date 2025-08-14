// controllers/attendanceController.js
const Clock = require("../models/Clock");
const User = require("../models/User");
const Attendance = require("../models/Attendance");

// 📌 Helper: Format datetime to IST
function formatIST(date) {
  if (!date) return null;
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

exports.getOwnAttendance = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const logs = await Attendance.find({ userId: user._id }).sort({ date: 1 });
    const formatted = formatAttendance(logs);

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWorkerAttendance = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const logs = await Attendance.find({ userId: user._id }).sort({ date: 1 });
    const formatted = formatAttendance(logs);

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

function formatAttendance(logs) {
  return logs.map(l => ({
    date: l.date.toLocaleDateString("en-IN"),
    totalHours: l.totalHours,
    sessions: [{
      clockIn: l.clockInTime?.toLocaleString("en-IN") || null,
      clockOut: l.clockOutTime?.toLocaleString("en-IN") || null,
      duration: l.duration || "N/A"
    }]
  }));
}

