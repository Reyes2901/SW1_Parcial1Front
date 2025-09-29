//src/pages/ProfilePage.tsx
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

  const handleChange =
    (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await updateProfile(form);
      setMsg("✅ Perfil actualizado correctamente.");
    } catch (err: any) {
      setMsg(
        "❌ Error: " +
          (err?.response?.data
            ? JSON.stringify(err.response.data)
            : err?.message)
      );
    } finally {
      setSaving(false);
    }
  };

  // Avatar con iniciales
  const initials =
    (form.first_name?.charAt(0) || "") + (form.last_name?.charAt(0) || "");

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
        {/* Encabezado con avatar */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-600 text-white text-xl font-bold">
            {initials || form.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Mi Perfil</h2>
            <p className="text-gray-500">Gestiona tu información personal</p>
          </div>
        </div>

        {/* Mensaje */}
        {msg && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              msg.startsWith("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {msg}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <input
              value={form.username}
              onChange={handleChange("username")}
              required
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              required
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                value={form.first_name}
                onChange={handleChange("first_name")}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Apellido
              </label>
              <input
                value={form.last_name}
                onChange={handleChange("last_name")}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className={`bg-green-600 text-white px-4 py-2 rounded-lg transition ${
                saving ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
              }`}
              onClick={() => navigate("/dashboard")}

            >
              {saving ? "Guardando..." : "Guardar cambios"}
              
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

