// src/pages/ProjectForm.tsx
import React, { useEffect, useState } from "react";
import { createProject, getProject, updateProject } from "../api/projects";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState({ name: "", description: "", start_date: "" });
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
    return () => { mounted = false; };
  }, [id, isEdit, logout, navigate]);

  const handleChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      setError(err?.response?.data ? JSON.stringify(err.response.data) : "Error guardando proyecto");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      <h2>{isEdit ? "Editar proyecto" : "Crear proyecto"}</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Nombre</label><br />
          <input value={form.name} onChange={handleChange("name")} required />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Descripción</label><br />
          <textarea value={form.description} onChange={handleChange("description")} rows={4} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Start date</label><br />
          <input type="date" value={form.start_date} onChange={handleChange("start_date")} />
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
          <button type="button" onClick={() => navigate("/projects")} style={{ marginLeft: 8 }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
// Fin src/pages/ProjectForm.tsx