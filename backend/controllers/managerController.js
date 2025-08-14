const User = require("../models/User");
const Clock = require("../models/Clock");
const Attendance = require("../models/Attendance");
const jwt = require("jsonwebtoken");

// Set location for a user (worker)
exports.setLocation = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Location (latitude & longitude) is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== "manager") {
      return res.status(403).json({ message: "Only managers can set location" });
    }

    user.location = { latitude, longitude, radius: radius || 1000 };
    await user.save();

    res.json({ message: "location updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}; 


// Permit or restrict access for a user (enable/disable)
exports.setUserPermission = async (req, res) => {
  try {
    const { userId, permitted } = req.body;  // permitted: boolean

    if (!userId || typeof permitted !== "boolean") {
      return res.status(400).json({ message: "userId and permitted(boolean) are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.permitted = permitted;  // add 'permitted' boolean in User schema
    await user.save();

    res.json({ message: `User permission set to ${permitted}`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// // Get all users (with optional role filter)
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query; // optional role filter

    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter).select("-password"); // exclude passwords

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// GET /api/manager/users
exports.getAllActiveWorkers = async (req, res) => {
  try {
    // Manager's email is in JWT payload (set in auth middleware)
    const managerEmail = req.user.email;

    // Find the manager's record
    const manager = await User.findOne({ email: managerEmail, role: "manager" });
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Find all workers linked to this manager
    // Assuming your User schema has a `managerId` or `managerEmail` field
    const workers = await User.find({ managerId: manager._id, role: "worker" });

    res.json({
      workers: workers.map((w) => ({
        name: w.name,
        email: w.email,
        role: w.role,
        permitted: w.permitted, // boolean
        createdAt: w.createdAt
      }))
    });
  } catch (err) {
    console.error("Error fetching workers:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAttendanceLogs = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const filter = {};
    if (userId) filter.userId = userId;
   if (startDate || endDate) {
    filter.date = {};
   if (startDate) filter.date.$gte = new Date(startDate);
   if (endDate) filter.date.$lte = new Date(endDate);
   }


    const logs = await Clock.find(filter).sort({ time: 1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.getOverview = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const manager = await User.findById(decoded.id);
    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const workers = await User.find({ managerId: manager._id }).select("_id name");
    const workerIds = workers.map(w => w._id);

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    // 1. Average hours per day
    const avgHoursPerDay = await Attendance.aggregate([
      { $match: { userId: { $in: workerIds }, date: { $gte: sevenDaysAgo } } },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          hoursWorked: {
            $cond: {
              if: { $and: ["$clockInTime", "$clockOutTime"] },
              then: {
                $divide: [
                  { $subtract: ["$clockOutTime", "$clockInTime"] },
                  1000 * 60 * 60
                ]
              },
              else: 0
            }
          }
        }
      },
      {
        $group: {
          _id: "$date",
          avgHours: { $avg: "$hoursWorked" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          avgHours: { $round: ["$avgHours", 2] },
          _id: 0
        }
      }
    ]);

    // 2. People clocking each day
    const peoplePerDay = await Attendance.aggregate([
      { $match: { userId: { $in: workerIds }, date: { $gte: sevenDaysAgo } } },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          userId: 1
        }
      },
      {
        $group: {
          _id: "$date",
          count: { $addToSet: "$userId" }
        }
      },
      {
        $project: {
          date: "$_id",
          count: { $size: "$count" },
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    // 3. Total hours per staff
    const totalHoursPerStaff = await Attendance.aggregate([
      { $match: { userId: { $in: workerIds }, date: { $gte: sevenDaysAgo } } },
      {
        $project: {
          userId: 1,
          hoursWorked: {
            $cond: {
              if: { $and: ["$clockInTime", "$clockOutTime"] },
              then: {
                $divide: [
                  { $subtract: ["$clockOutTime", "$clockInTime"] },
                  1000 * 60 * 60
                ]
              },
              else: 0
            }
          }
        }
      },
      {
        $group: {
          _id: "$userId",
          totalHours: { $sum: "$hoursWorked" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$user.name",
          totalHours: { $round: ["$totalHours", 2] },
          _id: 0
        }
      }
    ]);

    res.json({
      avgHoursPerDay,
      peoplePerDay,
      totalHoursPerStaff
    });
  } catch (err) {
    console.error("Manager overview error:", err);
    res.status(500).json({ message: "Server error" });
  }
};