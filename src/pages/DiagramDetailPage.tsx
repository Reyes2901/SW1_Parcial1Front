// src/pages/DiagramDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDiagram,
  updateDiagramContent,
  updateDiagram,
  deleteDiagram,
} from "../api/diagrams";

interface Diagram {
  id: number;
  name: string;
  content: any;
  project: number;
  updated_at: string;
}

const DiagramDetailPage: React.FC = () => {
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState<string>("");
  const [editingContent, setEditingContent] = useState<string>("");

  const { diagramId } = useParams<{ diagramId: string }>();
  const navigate = useNavigate();

  // -------------------
  // Cargar diagrama
  useEffect(() => {
    const loadDiagram = async () => {
      if (!diagramId) return;
      try {
        const data = await getDiagram(parseInt(diagramId));
        setDiagram(data);
        setEditingName(data.name);
        setEditingContent(JSON.stringify(data.content, null, 2));
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el diagrama.");
      } finally {
        setLoading(false);
      }
    };
    loadDiagram();
  }, [diagramId]);

  // -------------------
  // Actualizar nombre del diagrama (PATCH)
  const handleUpdateName = async () => {
    if (!diagram) return;
    try {
      const updated = await updateDiagram(diagram.id, { name: editingName });
      setDiagram(updated);
      alert("Nombre actualizado");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar nombre");
    }
  };

  // -------------------
  // Actualizar contenido del diagrama (PUT)
  const handleUpdateContent = async () => {
    if (!diagram) return;
    try {
      const parsedContent = JSON.parse(editingContent);
      await updateDiagramContent(diagram.id, parsedContent, diagram.updated_at);
      // Recargar diagrama
      const refreshed = await getDiagram(diagram.id);
      setDiagram(refreshed);
      setEditingContent(JSON.stringify(refreshed.content, null, 2));
      alert("Contenido actualizado");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409) {
        alert("El diagrama fue modificado por otro usuario. Recarga primero.");
      } else {
        alert("Error al actualizar contenido");
      }
    }
  };

  // -------------------
  // Eliminar diagrama (DELETE)
  const handleDelete = async () => {
    if (!diagram) return;
    if (!window.confirm("¿Seguro que quieres eliminar este diagrama?")) return;
    try {
      await deleteDiagram(diagram.id);
      alert("Diagrama eliminado");
      navigate(`/projects/${diagram.project}`); // Redirigir al proyecto
    } catch (err) {
      console.error(err);
      alert("Error al eliminar diagrama");
    }
  };

  if (loading) return <p>Cargando diagrama...</p>;
  if (error) return <p>{error}</p>;
  if (!diagram) return <p>No se encontró el diagrama.</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Diagrama: {diagram.name}</h2>
      <p><strong>Proyecto padre:</strong> {diagram.project}</p>

      {/* Formulario para actualizar nombre */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
        />
        <button onClick={handleUpdateName} style={{ marginLeft: "0.5rem" }}>
          Actualizar nombre
        </button>
      </div>

      {/* Editor de contenido */}
      <div style={{ marginBottom: "1rem" }}>
        <h3>Contenido</h3>
        <textarea
          rows={15}
          style={{ width: "100%", fontFamily: "monospace", padding: "0.5rem" }}
          value={editingContent}
          onChange={(e) => setEditingContent(e.target.value)}
        />
        <button onClick={handleUpdateContent} style={{ marginTop: "0.5rem" }}>
          Actualizar contenido
        </button>
      </div>

      {/* Mostrar contenido en pre */}
      <div>
        <h4>Vista previa del contenido:</h4>
        <pre style={{ background: "#f5f5f5", padding: "1rem", borderRadius: 6 }}>
          {JSON.stringify(diagram.content, null, 2)}
        </pre>
      </div>

      {/* Botón de eliminar */}
      <button
        onClick={handleDelete}
        style={{ marginTop: "1rem", background: "red", color: "#fff", padding: "0.5rem 1rem" }}
      >
        Eliminar diagrama
      </button>
    </div>
  );
};

export default DiagramDetailPage;
