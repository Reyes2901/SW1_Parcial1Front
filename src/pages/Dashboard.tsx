// src/pages/Dashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Dashboard</h1>
      {user ? <p>Bienvenido, <b>{user.username}</b></p> : <p>No hay usuario</p>}
      <div style={{ marginTop: 12 }}>
        <button onClick={() => navigate("/projects")}>Mis proyectos</button>
        <button onClick={() => navigate("/profile")} style={{ marginLeft: 8 }}>Mi perfil</button>
        <button onClick={handleLogout} style={{ marginLeft: 8 }}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default Dashboard;
