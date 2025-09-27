// src/api/auth.ts
import axios from "axios";

export const API_URL = "http://localhost:8000/api"; // ajusta si es necesario

export const api = axios.create({
  baseURL: API_URL,
});

// Establece o elimina la cabecera Authorization para toda la instancia 'api'
export const setAuthToken = (token?: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Token ${token}`; // DRF TokenAuth
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Users endpoints
export const registerUser = async (payload: { username: string; email: string; password: string; }) => {
  const res = await api.post("/users/registro/", payload);
  return res.data;
};

export const loginUser = async (username: string, password: string) => {
  const res = await api.post("/users/login/", { username, password });
  return res.data; // { token, user }
};

export const logoutUser = async () => {
  const res = await api.post("/users/logout/");
  return res.data;
};

export const getPerfil = async () => {
  const res = await api.get("/users/perfil/");
  return res.data;
};

export const updatePerfil = async (payload: any) => {
  const res = await api.put("/users/perfil/", payload);
  return res.data;
};
