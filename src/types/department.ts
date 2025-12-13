// src/types/department.ts
export interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  staff?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
}

export interface DepartmentCreateData {
  name: string;
  description?: string;
}

export interface DepartmentUpdateData {
  name?: string;
  description?: string;
}