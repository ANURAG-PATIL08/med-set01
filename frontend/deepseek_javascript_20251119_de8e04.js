import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Create axios instances for different endpoints
export const authAPI = axios.create({
  baseURL: BASE_URL,
});

export const fitnessAPI = axios.create({
  baseURL: BASE_URL,
});

export const nutritionAPI = axios.create({
  baseURL: BASE_URL,
});

export const medicationAPI = axios.create({
  baseURL: BASE_URL,
});

export const firstAidAPI = axios.create({
  baseURL: BASE_URL,
});

export const doctorsAPI = axios.create({
  baseURL: BASE_URL,
});

// Add token to all requests
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Add interceptors to all API instances
const instances = [authAPI, fitnessAPI, nutritionAPI, medicationAPI, firstAidAPI, doctorsAPI];

instances.forEach(instance => {
  instance.interceptors.request.use(addAuthToken);
  
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
});