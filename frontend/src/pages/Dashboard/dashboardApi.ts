import axiosInstance from '../../lib/axios';
import type { DashboardResponse, ProjectResponse } from './types';

export async function getDashboard(signal?: AbortSignal): Promise<DashboardResponse> {
  const response = await axiosInstance.get<DashboardResponse>('/dashboard', { signal });
  return response.data;
}

export async function getProjects(signal?: AbortSignal): Promise<ProjectResponse[]> {
  const response = await axiosInstance.get<ProjectResponse[]>('/projects', { signal });
  return response.data;
}
