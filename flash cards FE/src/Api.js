import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

let logoutHandler = () => {}; 

export const setLogoutHandler = (handler) => {
  logoutHandler = handler; 
};

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized API call detected. Passing error to application handler.");
    }
    return Promise.reject(error);
  }
);

export default api;