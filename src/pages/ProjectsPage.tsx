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

        // Filtrar duplicados por ID para evitar errores de React con keys
        const uniqueProjects = Array.from(new Map(data.map(p => [p.id, p])).values());

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
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err?.response?.data?.detail || "Error eliminando proyecto");
    }
  };

  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Proyectos</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => navigate("/projects/new")}>Crear proyecto</button>
      </div>

      {projects.length === 0 ? (
        <p>No tienes proyectos aún.</p>
      ) : (
        <ul>
          {projects.map(p => (
            <li key={p.id} style={{ marginBottom: 8 }}>
              <strong>{p.name}</strong>
              <div>
                <button onClick={() => navigate(`/projects/${p.id}`)}>Ver</button>
                <button
                  onClick={() => navigate(`/projects/${p.id}/edit`)}
                  style={{ marginLeft: 8 }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{ marginLeft: 8 }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsPage;
