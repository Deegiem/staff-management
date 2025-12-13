// src/app/roles/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRoles, roleApi } from '@/hooks/useRoles';

export default function RolesPage() {
  const { roles, isLoading, isError, mutate } = useRoles();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the "${name}" role?`)) return;
    
    setLoadingId(id);
    try {
      await roleApi.delete(id);
      mutate();
      alert('Role deleted successfully');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete role');
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Loading roles...</span>
    </div>
  );

  if (isError) return (
    <div className="container mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h2 className="text-red-800 font-semibold">Error loading roles</h2>
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
        <h1 className="text-2xl font-bold">Roles</h1>
        <Link
          href="/roles/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Role
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto w-full">
        <table className="min-w-max md:min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Base Salary
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
            {roles?.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {role.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {role.description || 'No description'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {role.baseSalary ? `₦${role.baseSalary.toLocaleString()}` : 'Not set'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(role.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    href={`/roles/${role.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </Link>
                  <Link
                    href={`/roles/${role.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(role.id, role.name)}
                    disabled={loadingId === role.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {loadingId === role.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!roles || roles.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No roles found. Create your first role to get started.
          </div>
        )}
      </div>
    </div>
  );
}