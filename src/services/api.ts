import axios from 'axios';
/*
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // URL base del backend
  withCredentials: true,                  
});

export default api;*/
const API_URL = process.env.REACT_APP_API_URL;

export const getProjects = async () => {
  const response = await fetch(`${API_URL}/api/projects/`);
  if (!response.ok) throw new Error("Error fetching projects");
  return response.json();
};

