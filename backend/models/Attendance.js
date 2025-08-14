const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  clockInTime: Date,
  clockOutTime: Date,
  location: {
    latitude: Number,
    longitude: Number
  },
  status: { type: String, enum: ["Present", "Absent", "Late"], default: "Present" }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
