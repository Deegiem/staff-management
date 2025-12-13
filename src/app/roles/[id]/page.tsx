// src/app/roles/[id]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useRole } from '@/hooks/useRoles';

export default function RoleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { role, isLoading, isError } = useRole(id);

  if (isLoading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Loading role...</span>
    </div>
  );
  
  if (isError) return (
    <div className="text-red-600 p-4">Error loading role</div>
  );
  
  if (!role) return (
    <div className="text-gray-600 p-4">Role not found</div>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Role Details</h1>
        <Link
          href="/roles"
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Roles
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">{role.name}</h2>
          {role.description && (
            <p className="text-gray-600 mt-1">{role.description}</p>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Role Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900">{role.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="text-sm text-gray-900">
                    {role.description || 'No description provided'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Base Salary</dt>
                  <dd className="text-sm text-gray-900">
                    {role.baseSalary ? `₦${role.baseSalary.toLocaleString()}` : 'Not set'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(role.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(role.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <Link
              href={`/roles/${role.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Role
            </Link>
            <Link
              href="/roles"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}