//src/pages/ProjectDetailPage.tsx
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

  if (!project)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Cargando proyecto...</p>
      </div>
    );

  const isOwner = currentUser?.id === project.owner.id;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
        <p className="text-gray-700 mb-6">{project.description}</p>

        {/* ==================== COLABORADORES ==================== */}
        <h3 className="text-xl font-semibold mb-2">Colaboradores</h3>
        {project.collaborators.filter((u) => u.id !== currentUser?.id).length === 0 ? (
          <p className="text-gray-500 mb-4">No hay colaboradores.</p>
        ) : (
          <ul className="mb-4 space-y-2">
            {project.collaborators
              .filter((u) => u.id !== currentUser?.id)
              .map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <span>{user.username}</span>
                  {isOwner && (
                    <button
                      onClick={() => handleRemoveCollaborator(user.id)}
                      className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  )}
                </li>
              ))}
          </ul>
        )}

        {isOwner && (
          <form onSubmit={handleAddCollaborator} className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Agregar
            </button>
          </form>
        )}

        {/* ==================== DIAGRAMAS ==================== */}
        <h3 className="text-xl font-semibold mb-2">Diagramas</h3>
        {diagrams.length === 0 ? (
          <p className="text-gray-500 mb-4">No hay diagramas en este proyecto.</p>
        ) : (
          <ul className="mb-4 space-y-2">
            {diagrams.map((diagram) => (
              <li key={diagram.id} className="border-b pb-2">
                <Link
                  to={`/projects/${id}/diagrams/${diagram.id}`}
                  className="text-green-600 hover:underline"
                >
                  {diagram.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link to={`/projects/${id}/diagrams/create`}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Crear diagrama
          </button>
        </Link>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ProjectDetailPage;

