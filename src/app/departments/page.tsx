// src/app/departments/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useDepartments, departmentApi } from '@/hooks/useDepartments';

export default function DepartmentsPage() {
  const { departments, isLoading, isError, mutate } = useDepartments();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the "${name}" department?`)) return;
    
    setLoadingId(id);
    try {
      await departmentApi.delete(id);
      mutate();
      alert('Department deleted successfully');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete department');
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Loading departments...</span>
    </div>
  );

  if (isError) return (
    <div className="container mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h2 className="text-red-800 font-semibold">Error loading departments</h2>
        <button
          onClick={() => mutate()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto overflow-hidden p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Departments</h1>
        <Link
          href="/departments/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Department
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto w-full">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments?.map((department) => (
              <tr key={department.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {department.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {department.description || 'No description'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(department.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    href={`/departments/${department.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </Link>
                  <Link
                    href={`/departments/${department.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(department.id, department.name)}
                    disabled={loadingId === department.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {loadingId === department.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!departments || departments.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No departments found. Create your first department to get started.
          </div>
        )}
      </div>
    </div>
  );
}