import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // URL base del backend
  withCredentials: true,                  // Importante si usas autenticación con cookies
});

export default api;
