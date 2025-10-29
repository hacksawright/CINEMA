import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${BASE_URL}/api/staff`,
});

export const getEmployees = () => api.get("");
export const addEmployee = (data) => api.post("", data);
export const updateEmployee = (id, data) => api.put(`/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/${id}`);