import axios from 'axios';

const API_GATEWAY_URL = '<API_GATEWAY_URL>';

export async function createTask(task) {
  return await axios.post(`${API_GATEWAY_URL}/tasks`, task);
}

export async function getTasks() {
  return await axios.get(`${API_GATEWAY_URL}/tasks`);
}

export async function updateTask(task) {
  return await axios.put(`${API_GATEWAY_URL}/tasks/${task.id}`, task);
}

export async function deleteTask(taskId) {
  return await axios.delete(`${API_GATEWAY_URL}/tasks/${taskId}`);
}