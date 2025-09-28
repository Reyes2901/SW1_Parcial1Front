// src/routes/AppRoutes.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/registerPage";
import Dashboard from "../pages/Dashboard";
import ProfilePage from "../pages/ProfilePage";
import ProjectsPage from "../pages/ProjectsPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import ProjectForm from "../pages/ProjectForm";
import ProjectDetailPage from "../pages/ProjectDetailPage";
import DiagramDetailPage from "../pages/DiagramDetailPage";
import DiagramPage from "../pages/DiagramPage";
import DiagramCreatePage from "../pages/DiagramCreatePage";

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

        {/* Rutas privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <ProjectsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/new"
          element={
            <PrivateRoute>
              <ProjectForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <PrivateRoute>
              <ProjectDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:id/edit"
          element={
            <PrivateRoute>
              <ProjectForm />
            </PrivateRoute>
          }
        />

        {/* Diagrams dentro de proyectos */}
        <Route
          path="/projects/:projectId/diagrams"
          element={
            <PrivateRoute>
              <DiagramPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:projectId/diagrams/create"
          element={
            <PrivateRoute>
              <DiagramCreatePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:projectId/diagrams/:diagramId"
          element={
            <PrivateRoute>
              <DiagramDetailPage />
            </PrivateRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
// Fin src/routes/AppRoutes.tsx
