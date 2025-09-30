import React, { useEffect, useState } from "react";
import { Diagram, listDiagramsByProject, deleteDiagram } from "../api/diagrams";
import { Link } from "react-router-dom";

const DiagramsPage: React.FC = () => {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [error, setError] = useState("");

  const loadDiagrams = async () => {
    try {
      //const data = await ge;
     // setDiagrams(data);
    } catch {
      setError("No se pudieron cargar los diagramas.");
    }
  };

  useEffect(() => {
    loadDiagrams();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteDiagram(id);
      setDiagrams(diagrams.filter(d => d.id !== id));
    } catch {
      setError("Error al eliminar diagrama.");
    }
  };

  return (
    <div>
      <h2>Diagramas</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Link to="/diagrams/create">Crear Nuevo Diagrama</Link>
      <ul>
        {diagrams.map((diagram) => (
          <li key={diagram.id}>
            <Link to={`/diagrams/${diagram.id}`}>{diagram.name}</Link>{" "}
            <button onClick={() => handleDelete(diagram.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiagramsPage;

//correo medio dia lunes: mafir77459@mv6a.com contra: 13784954_Abby