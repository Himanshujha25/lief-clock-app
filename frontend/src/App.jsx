import React from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import WorkerDashboard from "./pages/WorkerDashboard";
import ManagerDashboard from "./pages/Manager_dashboard";
import OAuthSuccess from "./pages/OAuthSuccess";

export default function App() {
  const location = useLocation();

  // Hide navbar for worker routes
 const hideNavbar =
  location.pathname.startsWith("/worker") ||
  location.pathname.startsWith("/manager");

  

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div style={{ minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard/>}/>
          <Route path="oauth-success" element={<OAuthSuccess/>}/>
        </Routes>
      </div>

      {!hideNavbar && <Footer />}
    </>
  );
}
