// src/app/staff/[id]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useStaff } from '@/hooks/useStaff';
import Image from 'next/image';

export default function StaffDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { staff, isLoading, isError } = useStaff(id);

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;
  if (isError) return <div className="text-red-600 p-4">Error loading staff</div>;
  if (!staff) return <div className="text-gray-600 p-4">Staff not found</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Details</h1>
        <Link
          href="/staff"
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Staff List
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="bg-blue-100 px-6 py-4 border-b">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold">
              {staff.profilePhoto ? (
                <Image
                  width={400}
                  height={400}
                  className="h-16 w-16 object-cover rounded-full"
                  src={staff.profilePhoto}
                  alt={`${staff.firstName} ${staff.lastName}`}
                />
              ) : (
                `${staff.firstName[0]}${staff.lastName[0]}`
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {staff.firstName} {staff.lastName}
              </h2>
              <p className="text-gray-600">{staff.email}</p>
              <span
                className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                  staff.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {staff.status}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="text-sm text-gray-900">
                    {staff.firstName} {staff.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{staff.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-sm text-gray-900">{staff.phone || 'Not provided'}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="text-sm text-gray-900">{staff.role.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Department</dt>
                  <dd className="text-sm text-gray-900">{staff.department.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Employment Type</dt>
                  <dd className="text-sm text-gray-900 capitalize">
                    {staff.employmentType.toLowerCase().replace('_', ' ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date of Hire</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(staff.dateOfHire).toLocaleDateString()}
                  </dd>
                </div>
                {staff.dateOfExit && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date of Exit</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(staff.dateOfExit).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Link
              href={`/staff/${staff.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Staff
            </Link>
            <Link
              href="/staff"
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