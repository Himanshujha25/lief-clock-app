import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (decoded.role === "manager") {
        navigate("/manager/dashboard");
      } else if (decoded.role === "worker") {
        navigate("/worker/dashboard");
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  return <div>Redirecting...</div>;
}
