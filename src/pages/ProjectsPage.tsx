// src/pages/ProjectsPage.tsx
import React, { useEffect, useState } from "react";
import { getProjects } from "../api/projects";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const data = await getProjects();
        if (!mounted) return;
        setProjects(data);
      } catch (err: any) {
        console.error("Error loading projects:", err);
        if (err?.response?.status === 401) {
          // token inválido -> limpiar sesión global
          await logout();
          navigate("/login", { replace: true });
        } else {
          setError(err?.response?.data?.detail || "Error cargando proyectos");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [logout, navigate]);

  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Proyectos</h2>
      {projects.length === 0 ? <p>No tienes proyectos aún.</p> : (
        <ul>
          {projects.map((p) => <li key={p.id}><b>{p.name}</b> — {p.description}</li>)}
        </ul>
      )}
    </div>
  );
};

export default ProjectsPage;
// Fin src/pages/ProjectsPage.tsx