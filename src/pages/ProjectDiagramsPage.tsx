// src/pages/ProjectDiagramsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { listDiagramsByProject, Diagram } from "../api/diagrams";

const ProjectDiagramsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDiagrams = async () => {
      if (!projectId) return;
      try {
        const data = await listDiagramsByProject(parseInt(projectId));
        setDiagrams(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los diagramas del proyecto.");
      } finally {
        setLoading(false);
      }
    };

    loadDiagrams();
  }, [projectId]);

  if (loading) return <p>Cargando diagramas...</p>;
  if (error) return <p>{error}</p>;
  if (diagrams.length === 0) return <p>No hay diagramas en este proyecto.</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Diagramas del Proyecto {projectId}</h2>
      <ul>
        {diagrams.map((diagram) => (
          <li key={diagram.id}>
            <Link to={`/projects/${projectId}/diagrams/${diagram.id}`}>
              {diagram.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDiagramsPage;
