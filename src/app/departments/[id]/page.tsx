// src/app/departments/[id]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDepartment } from '@/hooks/useDepartments';

export default function DepartmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { department, isLoading, isError } = useDepartment(id);

  if (isLoading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Loading department...</span>
    </div>
  );
  
  if (isError) return (
    <div className="text-red-600 p-4">Error loading department</div>
  );
  
  if (!department) return (
    <div className="text-gray-600 p-4">Department not found</div>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Department Details</h1>
        <Link
          href="/departments"
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Departments
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">{department.name}</h2>
          {department.description && (
            <p className="text-gray-600 mt-1">{department.description}</p>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Department Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900">{department.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="text-sm text-gray-900">
                    {department.description || 'No description provided'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(department.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(department.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Add staff count or other stats here later */}
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <Link
              href={`/departments/${department.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Department
            </Link>
            <Link
              href="/departments"
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