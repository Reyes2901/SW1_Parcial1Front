// src/pages/ProjectDetailPage.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosInstance";

interface User {
  id: number;
  username: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  collaborators: User[];
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  // ✅ Función para cargar los datos del proyecto
  const loadProject = useCallback(async () => {
    try {
      const res = await axios.get(`/projects/${id}/`);
      setProject(res.data);
    } catch (err) {
      setError("No se pudo cargar el proyecto.");
    }
  }, [id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // ✅ Agregar colaborador
  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`/projects/${id}/collaborators/`, { username });
      setUsername("");
      await loadProject();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al agregar colaborador.");
    }
  };

  // ✅ Eliminar colaborador
  const handleRemoveCollaborator = async (userId: number) => {
    try {
      await axios.delete(`/projects/${id}/collaborators/${userId}/`);
      await loadProject();
    } catch (err) {
      setError("Error al eliminar colaborador.");
    }
  };

  if (!project) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Proyecto: {project.name}</h2>
      <p>{project.description}</p>

      <h3>Colaboradores</h3>
      {project.collaborators.length === 0 ? (
        <p>No hay colaboradores.</p>
      ) : (
        <ul>
          {project.collaborators.map((user) => (
            <li key={user.id}>
              {user.username}{" "}
              <button onClick={() => handleRemoveCollaborator(user.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      <h4>Agregar colaborador</h4>
      <form onSubmit={handleAddCollaborator}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Agregar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ProjectDetailPage;
