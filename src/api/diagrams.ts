//import axios from 'axios';
import axios from './axiosInstance';

export const getDiagrams = async () => {
  const res = await axios.get('/diagrams/');
  return res.data;
};

export const getDiagramById = async (id: number) => {
  const res = await axios.get(`/diagrams/${id}/`);
  return res.data;
};

export const createDiagram = async (data: any) => {
  const res = await axios.post('/diagrams/', data);
  return res.data;
};

export const updateDiagram = async (id: number, data: any) => {
  const res = await axios.put(`/diagrams/${id}/`, data);
  return res.data;
};

export const deleteDiagram = async (id: number) => {
  const res = await axios.delete(`/diagrams/${id}/`);
  return res.data;
};

// Leer contenido
export const getDiagramContent = async (id: number) => {
  const res = await axios.get(`/diagrams/${id}/content/read/`);
  return res.data;
};

// Actualizar contenido
export const updateDiagramContent = async (id: number, content: any) => {
  const res = await axios.put(`/diagrams/${id}/content/`, content);
  return res.data;
};
// Compartir diagrama
export const shareDiagram = async (diagramId: number, userId: number) => {
  const res = await axios.post(`/diagrams/${diagramId}/share/`, { user_id: userId });
  return res.data;
};