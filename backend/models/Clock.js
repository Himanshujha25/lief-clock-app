// models/Clock.js
const mongoose = require("mongoose");

const clockSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["in", "out"], required: true },
  time: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Clock", clockSchema);
