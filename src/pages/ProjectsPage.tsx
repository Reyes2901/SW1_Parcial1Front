// src/pages/ProjectsPage.tsx
import React, { useEffect, useState } from "react";
import { getProjects, deleteProject, Project } from "../api/projects";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchProjects = async () => {
      try {
        const data = await getProjects();

        if (!mounted) return;

        // Eliminar duplicados por ID
        const uniqueProjects = Array.from(
          new Map(data.map((p) => [p.id, p])).values()
        );

        setProjects(uniqueProjects);
      } catch (err: any) {
        console.error("Error loading projects:", err);

        if (err?.response?.status === 401) {
          await logout();
          navigate("/login", { replace: true });
        } else {
          setError(err?.response?.data?.detail || "Error cargando proyectos");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProjects();
    return () => {
      mounted = false;
    };
  }, [logout, navigate]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar proyecto?")) return;

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err?.response?.data?.detail || "Error eliminando proyecto");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Cargando proyectos...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Mis Proyectos</h2>
          <button
            onClick={() => navigate("/projects/new")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            + Crear proyecto
          </button>
        </div>

        {projects.length === 0 ? (
          <p className="text-gray-600">No tienes proyectos aún.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => navigate(`/projects/${p.id}/edit`)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;

