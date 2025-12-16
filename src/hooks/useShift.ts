// src/hooks/useRoles.ts
import useSWR from 'swr';
import { Shift, ShiftCreateData, ShiftUpdateData } from '@/types/shift';

const API_BASE = '/api/shift';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data;
};

export const useRoles = () => {
  const { data, error, mutate } = useSWR(API_BASE, fetcher);

  return {
    roles: data?.data as Role[],
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

export const useRole = (id?: string) => {
  const { data, error, mutate } = useSWR(
    id ? `${API_BASE}/${id}` : null,
    fetcher
  );

  return {
    role: data?.data as Role,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

export const roleApi = {
  create: async (data: RoleCreateData) => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to create role');
    return result;
  },

  update: async (id: string, data: RoleUpdateData) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update role');
    return result;
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete role');
    return result;
  },
};