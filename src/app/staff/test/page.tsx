// src/app/staff/test/page.tsx - Temporary test page
'use client';
import { useStaffList } from '@/hooks/useStaff';

export default function TestStaffPage() {
  const { staff, isLoading, isError, error } = useStaffList();
  
  console.log('Test Page - Hook Data:', {
    staff,
    isLoading,
    isError,
    error,
    errorType: typeof error,
    errorValue: error
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {String(error)}</div>;
  
  return (
    <div>
      <h1>Staff Count: {staff?.length}</h1>
      <pre>{JSON.stringify(staff, null, 2)}</pre>
    </div>
  );
}