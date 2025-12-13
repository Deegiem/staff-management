// src/types/role.ts
export interface Role {
  id: string;
  name: string;
  description?: string;
  baseSalary?: number;
  createdAt: string;
  updatedAt: string;
  staff?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
}

export interface RoleCreateData {
  name: string;
  description?: string;
  baseSalary?: number;
}

export interface RoleUpdateData {
  name?: string;
  description?: string;
  baseSalary?: number;
}