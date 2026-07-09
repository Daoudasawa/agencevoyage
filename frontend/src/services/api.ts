import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur de requête pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs globales (ex: 401 déconnexion automatique)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Rediriger vers la connexion si le token a expiré ou est invalide
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/connexion') {
          window.location.href = '/connexion';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
