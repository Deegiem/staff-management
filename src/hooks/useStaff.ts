// src/hooks/useStaff.ts
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher'; // Import the new fetcher
import { Staff, StaffCreateData, StaffUpdateData } from '@/types/staff';

const API_BASE = '/api/staff';

// const fetcher = async (url: string) => {
//   const res = await fetch(url);
//   const data = await res.json();

//   if (!res.ok) {
//     const error = new Error(data.error || `Failed to fetch: ${res.status}`);
//     (error as any).status = res.status;
//     throw error;
//   }

//   return data;
// };

// export const fetcher = async (url: string) => {
//   const res = await fetch(url);

//   if (!res.ok) {
//     const errorData = await res.json().catch(() => ({}));
//     const error = new Error(errorData.error || 'An error occurred while fetching data.');
//     (error as any).status = res.status;
//     throw error;
//   }

//   return res.json();
// };

export const useStaff = (id?: string) => {
  const { data, error, mutate } = useSWR(
    id ? `${API_BASE}/${id}` : null,
    fetcher
  );

  return {
    staff: data?.data as Staff,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

export const useStaffList = (filters?: {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  role?: string;
  status?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.department) params.append('department', filters.department);
  if (filters?.role) params.append('role', filters.role);
  if (filters?.status) params.append('status', filters.status);

  const url = `${API_BASE}?${params.toString()}`;

  const { data, error, mutate } = useSWR(url, fetcher);

  return {
    staff: data?.data as Staff[],
    pagination: data?.pagination,
    isLoading: !error && !data,
    isError: !!error,
    error: error?.message || null, // Return message or null
    mutate
  };
};

export const useCurrentStaff = () => {
  const { data, error, mutate } = useSWR(`${API_BASE}/me`, fetcher);

  return {
    staff: data?.data as Staff,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

// API functions
export const staffApi = {
  create: async (data: StaffCreateData) => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to create staff');
    return result;
  },

  update: async (id: string, data: StaffUpdateData) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update staff');
    return result;
  },

  deactivate: async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to deactivate staff');
    return result;
  },

  activate: async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}/activate`, {
      method: 'POST',
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to activate staff');
    return result;
  },

  updateProfile: async (data: Partial<Staff>) => {
    const res = await fetch(`${API_BASE}/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update profile');
    return result;
  },
};