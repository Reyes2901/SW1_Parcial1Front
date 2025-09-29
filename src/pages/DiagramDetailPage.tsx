//src/pages/DiagramDetailPage.tsx
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
  // Actualizar nombre
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
  // Actualizar contenido
  const handleUpdateContent = async () => {
    if (!diagram) return;
    try {
      const parsedContent = JSON.parse(editingContent);
      await updateDiagramContent(diagram.id, parsedContent, diagram.updated_at);
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
  // Eliminar
  const handleDelete = async () => {
    if (!diagram) return;
    if (!window.confirm("¿Seguro que quieres eliminar este diagrama?")) return;
    try {
      await deleteDiagram(diagram.id);
      alert("Diagrama eliminado");
      navigate(`/projects/${diagram.project}`);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar diagrama");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Cargando diagrama...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );

  if (!diagram)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">No se encontró el diagrama.</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold">Diagrama: {diagram.name}</h2>
        <p className="text-gray-600">
          <strong>Proyecto padre:</strong> {diagram.project}
        </p>

        {/* Actualizar nombre */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleUpdateName}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Guardar
            </button>
          </div>
        </div>

        {/* Editor de contenido */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Contenido (JSON)
          </label>
          <textarea
            rows={12}
            className="w-full border rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
          />
          <button
            onClick={handleUpdateContent}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Actualizar contenido
          </button>
        </div>

        {/* Vista previa */}
        <div>
          <h4 className="text-lg font-semibold mb-2">
            Vista previa del contenido
          </h4>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(diagram.content, null, 2)}
          </pre>
        </div>

        {/* Eliminar */}
        <button
          onClick={handleDelete}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Eliminar diagrama
        </button>
      </div>
    </div>
  );
};

export default DiagramDetailPage;

