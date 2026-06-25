import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/tasks/api";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_by_id: number;
}

export interface CreateTask {
  title: string;
  description: string;
  status: string;
  created_by: number;
}

export interface EditTask {
  title: string;
  description: string;
  status: string;
}

// 1. Now to get tasks list from DB
export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get<Task[]>(`${API_BASE_URL}/getTasks`);
  return response.data;
};

// 2. To create a task on DB.
export const createTask = async (taskData: CreateTask) => {
  const response = await axios.post(`${API_BASE_URL}/createTask`, taskData);
  return response.data;
};

// 3. Editing existing task on DB
export const editTask = async (id: number, taskData: EditTask) => {
  const response = await axios.put(`${API_BASE_URL}/editTask/${id}`, taskData);
  return response.data;
};

// 4. Delete a given task using its ID
export const deleteTask = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/deleteTask/${id}`);
  return response.data;
};

// 5. Edit a task status using ID
export const editTaskStatus = async (id: number, status: string) => {
  const response = await axios.patch(`${API_BASE_URL}/editStatusOfTask/${id}`, {
    status,
  });
  return response.data;
};
