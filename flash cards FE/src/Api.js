import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

let logoutHandler = () => {}; // Placeholder function

export const setLogoutHandler = (handler) => {
  logoutHandler = handler; 
};

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      logoutHandler(); 
    }
    return Promise.reject(error);
  }
);

export default api;