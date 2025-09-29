//src/pages/DiagramCreatePage.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axiosInstance";

const DiagramCreatePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await axios.post("/diagrams/", {
        name,
        project: projectId, // proyecto padre
        content: {}, // contenido inicial vacío
      });
      navigate(`/projects/${projectId}/diagrams/${res.data.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || "Error al crear el diagrama.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Crear Diagrama</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nombre del diagrama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? "Creando..." : "Crear"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/projects/${projectId}`)}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiagramCreatePage;

