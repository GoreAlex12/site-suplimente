import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};

export default ProtectedRoute;
