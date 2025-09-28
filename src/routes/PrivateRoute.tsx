// src/routes/PrivateRoute.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const auth = useAuth();

  if (!auth) {
    console.error("AuthContext no está disponible. ¿Olvidaste envolver con AuthProvider?");
    return <Navigate to="/login" replace />;
  }

  const { user, loading } = auth;

  if (loading) {
    return <div>Cargando...</div>; // aquí puedes poner un spinner
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
