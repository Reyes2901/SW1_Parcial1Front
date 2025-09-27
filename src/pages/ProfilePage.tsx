// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username ?? "",
        email: user.email ?? "",
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
      });
    }
  }, [user]);

  const handleChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await updateProfile(form);
      setMsg("Perfil actualizado correctamente.");
    } catch (err: any) {
      setMsg("Error: " + (err?.response?.data ? JSON.stringify(err.response.data) : err?.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Mi Perfil</h2>
      {msg && <div>{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario</label>
          <br />
          <input value={form.username} onChange={handleChange("username")} required />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Email</label>
          <br />
          <input type="email" value={form.email} onChange={handleChange("email")} required />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Nombre</label>
          <br />
          <input value={form.first_name} onChange={handleChange("first_name")} />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Apellido</label>
          <br />
          <input value={form.last_name} onChange={handleChange("last_name")} />
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</button>
          <button type="button" onClick={() => navigate("/dashboard")} style={{ marginLeft: 8 }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
// Fin src/pages/ProfilePage.tsx