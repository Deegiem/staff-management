// src/hooks/useDepartments.ts
import useSWR from 'swr';
import { Department, DepartmentCreateData, DepartmentUpdateData } from '@/types/department';

const API_BASE = '/api/departments';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data;
};

export const useDepartments = () => {
  const { data, error, mutate } = useSWR(API_BASE, fetcher);

  return {
    departments: data?.data as Department[],
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

export const useDepartment = (id?: string) => {
  const { data, error, mutate } = useSWR(
    id ? `${API_BASE}/${id}` : null,
    fetcher
  );

  return {
    department: data?.data as Department,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

export const departmentApi = {
  create: async (data: DepartmentCreateData) => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to create department');
    return result;
  },

  update: async (id: string, data: DepartmentUpdateData) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update department');
    return result;
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete department');
    return result;
  },
};