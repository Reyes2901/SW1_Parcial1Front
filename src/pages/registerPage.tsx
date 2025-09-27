// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ username, email, password });
      navigate("/projects");
    } catch (err: any) {
      const payload = err?.response?.data ?? err?.message;
      setError(typeof payload === "string" ? payload : JSON.stringify(payload));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Registro</h2>
      {error && <pre style={{ color: "red" }}>{error}</pre>}
      <form onSubmit={handleSubmit}>
        <div>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" required />
        </div>
        <div style={{ marginTop: 8 }}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        </div>
        <div style={{ marginTop: 8 }}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>{loading ? "Registrando..." : "Registrarse"}</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
