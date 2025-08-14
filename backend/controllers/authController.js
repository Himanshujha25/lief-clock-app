const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const MANAGER_CODE = process.env.ADMIN_CODE;
const JWT_SECRET = process.env.JWT_SECRET;

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};


exports.register = async (req, res) => {
  try {
    const { name, email, password, role, managerEmail, managerCode } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "Name, email, and role are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    let assignedManagerId = null;
    let assignedManagerEmail = null;

    // Manager registration
    if (role === "manager") {
      if (managerCode !== MANAGER_CODE) {
        return res.status(403).json({ message: "Invalid manager code" });
      }
    }

    // Worker registration
    if (role === "worker") {
      if (!managerEmail) {
        return res.status(400).json({ message: "Worker must provide a manager's email" });
      }

      const manager = await User.findOne({ email: managerEmail, role: "manager" });
      if (!manager) {
        return res.status(400).json({ message: "Manager with this email not found" });
      }

      assignedManagerId = manager._id;
      assignedManagerEmail = manager.email;

      console.log("✅ Assigned Manager ID:", assignedManagerId.toString());
      console.log("✅ Assigned Manager Email:", assignedManagerEmail);
    }

    // Hash password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Prepare user object
    const newUserData = {
      name,
      email,
      password: hashedPassword,
      role
    };

    if (role === "worker") {
      newUserData.managerId = assignedManagerId;
      newUserData.managerEmail = assignedManagerEmail;
    }

    if (role === "manager") {
      newUserData.managerCode = managerCode;
    }

    console.log("📦 New User Data:", newUserData);

    // Save user
    const newUser = new User(newUserData);
    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      role: newUser.role,
      managerEmail: newUser.managerEmail || null,
      managerId: newUser.managerId || null
    });

  } catch (err) {
    console.error("❌ Error in register:", err);
    return res.status(500).json({ message: err.message });
  }
};



// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "This account uses Google login" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res.json({
      message: "Login successful",
      token,
      role: user.role
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
