// src/pages/ProjectDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProject, Project } from "../api/projects";
import { useAuth } from "../context/AuthContext";
import CollaboratorsList from "../components/CollaboratorsList";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const projectId = Number(id);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const p = await getProject(projectId);
      setProject(p);
    } catch (err: any) {
      console.error("Project detail error:", err);
      if (err?.response?.status === 401) {
        await logout();
        navigate("/login", { replace: true });
      } else {
        setError("No se pudo cargar el proyecto. Revisa backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p>Cargando proyecto...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!project) return <p>Proyecto no encontrado.</p>;

  // decide whether current user can manage collaborators (simple owner check)
  const canManage = user?.username === project.owner?.username;

  return (
    <div style={{ padding: 16 }}>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <p><b>Owner:</b> {project.owner?.username}</p>
      <p><b>Start date:</b> {project.start_date ?? "—"}</p>
      <p><b>Creado:</b> {project.created_at}</p>

      <hr />

      {/* Collaborators component (will refresh itself against API) */}
      <CollaboratorsList projectId={projectId} showAddById={false} canManage={canManage} />

      <div style={{ marginTop: 12 }}>
        <button onClick={() => navigate(`/projects/${project.id}/edit`)}>Editar proyecto</button>
        <button onClick={() => navigate("/projects")} style={{ marginLeft: 8 }}>Volver</button>
      </div>
    </div>
  );
};

export default ProjectDetail;
