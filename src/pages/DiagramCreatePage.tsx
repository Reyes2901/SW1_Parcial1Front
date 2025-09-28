// src/pages/DiagramCreatePage.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axiosInstance";

const DiagramCreatePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await axios.post("/diagrams/", {
        name,
        project: projectId,  // <--- proyecto padre
        content: {},         // contenido inicial vacío
        });
        console.log("Diagrama creado:", res.data);
        navigate(`/projects/${projectId}/diagrams/${res.data.id}`);
    } catch (err) {
        console.error(err);
    }
    };



  return (
    <div style={{ padding: "2rem" }}>
      <h2>Crear Diagrama</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del diagrama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Crear</button>
      </form>
    </div>
  );
};

export default DiagramCreatePage;
