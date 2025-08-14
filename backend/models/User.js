// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  // Manager location & permissions
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    radius: { type: Number, default: 1000 } // meters
  },
  permitted: { type: Boolean, default: true },
managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // Authentication
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google login
  role: { type: String, enum: ["worker", "manager"], required: true },
  managerCode: { type: String } // Only for managers
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
