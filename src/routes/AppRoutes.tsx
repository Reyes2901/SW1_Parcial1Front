// src/routes/AppRoutes.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/registerPage";
import Dashboard from "../pages/Dashboard";
import ProfilePage from "../pages/ProfilePage";
import ProjectsPage from "../pages/ProjectsPage";
import ProjectForm from "../pages/ProjectForm";
import ProjectDetailPage from "../pages/ProjectDetailPage";
import DiagramPage from "../pages/DiagramPage";
import DiagramCreatePage from "../pages/DiagramCreatePage";
import DiagramDetailPage from "../pages/DiagramDetailPage";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Layout from "../layouts/Layout";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Rutas privadas con Layout */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<ProjectForm />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/:id/edit" element={<ProjectForm />} />
          <Route path="/projects/:projectId/diagrams" element={<DiagramPage />} />
          <Route path="/projects/:projectId/diagrams/create" element={<DiagramCreatePage />} />
          <Route path="/projects/:projectId/diagrams/:diagramId" element={<DiagramDetailPage />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
