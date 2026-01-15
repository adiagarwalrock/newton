import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getProfessionals = (source) => api.get(`/professionals/${source ? `?source=${source}` : ''}`);
export const createProfessional = (data) => api.post('/professionals/', data);
export const bulkImportProfessionals = (data) => api.post('/professionals/bulk/', data);

export default api;
