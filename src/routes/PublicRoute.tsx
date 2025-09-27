// src/routes/PublicRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PublicRouteProps {
  children: React.ReactElement;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
