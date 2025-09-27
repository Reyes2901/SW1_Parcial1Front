import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  // Rutas que NO deben llevar token
  const publicRoutes = ['/users/login/', '/users/registro/'];

  const isPublic = publicRoutes.some(route =>
    config.url?.includes(route)
  );

  if (!isPublic && token) {
    config.headers.Authorization = `Token ${token}`; // o 'Bearer' si usas JWT
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
