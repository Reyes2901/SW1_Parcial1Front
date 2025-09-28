// src/api/diagrams.ts
import axios from "./axiosInstance";

export interface Diagram {
  id: number;
  name: string;
  project: number;
  content: any;
  created_at: string;
  updated_at: string;
  created_by: number | null;
}

// -------------------
// Obtener todos los diagramas
export const getDiagrams = async (): Promise<Diagram[]> => {
  const res = await axios.get("/diagrams/");
  return res.data;
};

// -------------------
// Obtener un diagrama por ID
export const getDiagram = async (id: number): Promise<Diagram> => {
  const res = await axios.get(`/diagrams/${id}/`);
  return res.data;
};

// -------------------
// Crear un diagrama (inicializa contenido vacío)
export const createDiagram = async (diagram: { name: string; project: number }): Promise<Diagram> => {
  const res = await axios.post("/diagrams/", {
    name: diagram.name,
    project: diagram.project,
    content: {}, // inicialización vacía
  });
  return res.data;
};

// -------------------
// Actualizar contenido del diagrama (PUT)
export const updateDiagramContent = async (id: number, content: any, updated_at: string): Promise<any> => {
  const res = await axios.put(`/diagrams/${id}/content/`, { content, updated_at });
  return res.data;
};

// -------------------
// Actualizar propiedades del diagrama (PATCH)
export const updateDiagram = async (id: number, data: Partial<{ name: string; project: number }>): Promise<Diagram> => {
  const res = await axios.patch(`/diagrams/${id}/`, data);
  return res.data;
};

// -------------------
// Obtener solo el contenido del diagrama
export const getDiagramContent = async (id: number): Promise<any> => {
  const res = await axios.get(`/diagrams/${id}/content/read/`);
  return res.data;
};

// -------------------
// Eliminar diagrama
export const deleteDiagram = async (id: number): Promise<void> => {
  await axios.delete(`/diagrams/${id}/`);
};

// -------------------
// Listar diagramas por proyecto (GET con query params)
export const listDiagramsByProject = async (projectId: number): Promise<Diagram[]> => {
  const res = await axios.get(`/diagrams/?project=${projectId}`);
  return res.data;
};
