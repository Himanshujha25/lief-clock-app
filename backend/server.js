const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const jwt = require("jsonwebtoken");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const clockRoutes = require("./routes/clockRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const managerRoutes = require("./routes/manager");
const authRoutes = require("./routes/authRoutes");
const profileRoute = require("./routes/profile");

// Load passport config
require("./config/passportGoogle"); // No (passport) here

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://lief-clock-app.onrender.com"], 
  credentials: true
}));


app.use(express.json());
app.use(passport.initialize());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`https://lief-clock-app.vercel.app/oauth-success?token=${token}`);
  }
);

app.use("/api/auth", authRoutes);
app.use("/api/clock", clockRoutes);
app.use("/api", attendanceRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api", profileRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
