// src/services/api.js
import axios from 'axios';

// Важно: используем относительный путь
// Это заставит axios отправлять запросы на тот же домен/порт, 
// где работает приложение (http://localhost:5005)
const API_URL = '/api';

console.log('Using API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchCarcassData = async () => {
  try {
    const response = await api.get('/carcass');
    return response.data;
  } catch (error) {
    console.error('Error fetching carcass data:', error);
    throw error;
  }
};

export const fetchCarcassDetail = async (id) => {
  try {
    const response = await api.get(`/carcass/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching carcass detail for ID ${id}:`, error);
    throw error;
  }
};

export const checkImages = async (id) => {
  try {
    const response = await api.get(`/check-images/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error checking images for ID ${id}:`, error);
    throw error;
  }
};

// Добавим функцию для проверки соединения
export const checkHealth = async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
};

export default api;