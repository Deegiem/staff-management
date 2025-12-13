// src/types/staff.ts
export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: string;
  departmentId: string;
  role: {
    id: string;
    name: string;
    description?: string;
    baseSalary?: number;
  };
  department: {
    id: string;
    name: string;
    description?: string;
  };
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  dateOfHire: string;
  dateOfExit?: string;
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffCreateData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: string;
  departmentId: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  dateOfHire: string;
}

export interface StaffUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  roleId?: string;
  departmentId?: string;
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  dateOfExit?: string;
  profilePhoto?: string;
}