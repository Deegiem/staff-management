// src/types/department.ts
export interface Shift {
  id: string;
  staffId: string;
  shiftId?: string;
  dayOfWeek: string;
  effectiveFrom: string;
  effectiveTo: string;
  staff?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
}

export interface ShiftCreateData {
  name: string;
  description?: string;
}

export interface ShiftUpdateData {
  name?: string;
  description?: string;
}

