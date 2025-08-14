import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #001529, #004d99)",
        color: "#fff",
        textAlign: "center",
        padding: "25px 15px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        fontFamily: "'Poppins', sans-serif",
        fontSize: "14px",
        letterSpacing: "0.5px",
        boxShadow: "0 -4px 15px rgba(0,0,0,0.3)",
        position: "relative",
      }}
    >
      <h2
        style={{
          margin: "0 0 5px",
          fontWeight: "600",
          fontSize: "18px",
          color: "#40a9ff",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        LiefCare Clock-In App
      </h2>
      <p style={{ margin: "0", opacity: 0.85 }}>
        © {new Date().getFullYear()} All Rights Reserved.
      </p>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "5px",
          transform: "translateX(-50%)",
          fontSize: "12px",
          opacity: 0.5,
        }}
      >
        Made with ❤️ by Himanshu
      </div>
    </footer>
  );
}
