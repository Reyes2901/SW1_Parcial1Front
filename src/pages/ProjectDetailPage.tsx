// src/pages/ProjectDetailPage.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

interface User {
  id: number;
  username: string;
}

interface Diagram {
  id: number;
  name: string;
  project: number;
}

interface Project {
  id: number;
  name: string;
  description: string;
  owner: User;
  collaborators: User[];
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  // ==================== CARGA DE DATOS ====================
  const loadProject = useCallback(async () => {
    try {
      const res = await axios.get(`/projects/${id}/`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el proyecto.");
    }
  }, [id]);
const loadDiagrams = useCallback(async () => {
  try {
    const res = await axios.get<Diagram[]>(`/diagrams/?project=${id}`);
    const uniqueDiagrams: Diagram[] = Array.from(
      new Map(res.data.map((d) => [d.id, d])).values()
    );
    setDiagrams(uniqueDiagrams);
  } catch (err) {
    console.error(err);
    setDiagrams([]);
    setError("No se pudieron cargar los diagramas.");
  }
}, [id]);

  useEffect(() => {
    loadProject();
    loadDiagrams();
  }, [loadProject, loadDiagrams]);

  // ==================== COLABORADORES ====================
  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`/projects/${id}/collaborators/`, { username });
      setUsername("");
      await loadProject();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al agregar colaborador.");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleRemoveCollaborator = async (userId: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar a este colaborador?")) return;
    try {
      await axios.delete(`/projects/${id}/collaborators/${userId}/`);
      await loadProject();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al eliminar colaborador.");
      setTimeout(() => setError(null), 5000);
    }
  };

  if (!project) return <p>Cargando proyecto...</p>;

  const isOwner = currentUser?.id === project.owner.id;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Proyecto: {project.name}</h2>
      <p>{project.description}</p>

      {/* ==================== COLABORADORES ==================== */}
      <h3>Colaboradores</h3>
      {project.collaborators.filter(u => u.id !== currentUser?.id).length === 0 ? (
        <p>No hay colaboradores.</p>
      ) : (
        <ul>
          {project.collaborators
            .filter(u => u.id !== currentUser?.id)
            .map(user => (
              <li key={user.id}>
                {user.username}{" "}
                {isOwner && (
                  <button onClick={() => handleRemoveCollaborator(user.id)}>Eliminar</button>
                )}
              </li>
            ))}
        </ul>
      )}

      {isOwner && (
        <form onSubmit={handleAddCollaborator}>
          <h4>Agregar colaborador</h4>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit">Agregar</button>
        </form>
      )}

      {/* ==================== DIAGRAMAS ==================== */}
      <h3>Diagramas</h3>
      {diagrams.length === 0 ? (
        <p>No hay diagramas en este proyecto.</p>
      ) : (
        <ul>
          {diagrams.map(diagram => (
            <li key={diagram.id}>
              <Link to={`/projects/${id}/diagrams/${diagram.id}`}>
                {diagram.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link to={`/projects/${id}/diagrams/create`}>
        <button>Crear diagrama</button>
      </Link>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
};

export default ProjectDetailPage;
