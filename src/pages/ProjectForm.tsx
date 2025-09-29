//src/pages/ProjectForm.tsx
import React, { useEffect, useState } from "react";
import { createProject, getProject, updateProject } from "../api/projects";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!isEdit) {
      setLoading(false);
      return;
    }
    const fetch = async () => {
      try {
        const data = await getProject(Number(id));
        if (!mounted) return;
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          start_date: data.start_date ?? "",
        });
      } catch (err: any) {
        console.error("Fetch project error:", err);
        if (err?.response?.status === 401) {
          await logout();
          navigate("/login", { replace: true });
        } else {
          setError("No se pudo cargar el proyecto");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, [id, isEdit, logout, navigate]);

  const handleChange =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((s) => ({ ...s, [k]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEdit && id) {
        await updateProject(Number(id), {
          name: form.name,
          description: form.description,
          start_date: form.start_date || null,
        });
        navigate(`/projects/${id}`);
      } else {
        const created = await createProject({
          name: form.name,
          description: form.description,
          start_date: form.start_date || null,
        });
        navigate(`/projects/${created.id}`);
      }
    } catch (err: any) {
      console.error("Save project error:", err);
      setError(
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : "Error guardando proyecto"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? "Editar proyecto" : "Crear proyecto"}
        </h2>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              value={form.name}
              onChange={handleChange("name")}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              rows={4}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Fecha inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de inicio
            </label>
            <input
              type="date"
              value={form.start_date}
              onChange={handleChange("start_date")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;

