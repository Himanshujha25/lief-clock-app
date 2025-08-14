// controllers/clockController.js
const Clock = require('../models/Clock');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

// Helper: Haversine formula to calculate distance in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
function formatDate(date) {
  const d = date;
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

exports.clockIn = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Location (latitude and longitude) is required" });
    }

    const userId = req.user.id;
    const lastEntry = await Clock.findOne({ userId }).sort({ time: -1 });
    if (lastEntry && lastEntry.type === "in") {
      return res.status(400).json({ message: "You are already clocked in" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.managerId) return res.status(400).json({ message: "No manager assigned" });

    const manager = await User.findById(user.managerId);
    if (!manager || !manager.location?.latitude || !manager.location?.longitude) {
      return res.status(400).json({ message: "Manager location is not set" });
    }

    const distance = getDistanceFromLatLonInKm(
      latitude, longitude,
      manager.location.latitude, manager.location.longitude
    );
    const allowedDistanceKm = (manager.location.radius || 1000) / 1000;
    if (distance > allowedDistanceKm) {
      return res.status(403).json({ message: `You are too far from manager's location. Distance: ${distance.toFixed(2)} km` });
    }

    // 1️⃣ Save clock event
    await Clock.create({ userId, type: "in", time: new Date() });

    // 2️⃣ Update Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to start of day
    await Attendance.findOneAndUpdate(
      { userId, date: today },
      {
        $set: {
          clockInTime: new Date(),
          status: "Present",
          location: { latitude, longitude }
        }
      },
      { upsert: true }
    );

    res.json({ message: "Clocked in successfully", time: formatDate(new Date()) });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.clockOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const lastEntry = await Clock.findOne({ userId }).sort({ time: -1 });
    if (!lastEntry || lastEntry.type === "out") {
      return res.status(400).json({ message: "You need to clock in first" });
    }

    // 1️⃣ Save clock event
    await Clock.create({ userId, type: "out", time: new Date() });

    // 2️⃣ Update Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await Attendance.findOneAndUpdate(
      { userId, date: today },
      { $set: { clockOutTime: new Date() } }
    );

    res.json({ message: "Clocked out successfully", time: formatDate(new Date()) });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
