// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import StaffTable from "@/components/StaffTable";
// import Image from "next/image";

// type Staff = {
//   id: number;
//   name: string;
//   email: string;
//   position: string;
// };

// export default function StaffPage() {
//   const [staff, setStaff] = useState<Staff[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStaff = async () => {
//       try {
//         const res = await fetch("/api/staff");
//         const data = await res.json();
//         setStaff(data);
//       } catch (error) {
//         console.error("Error fetching staff:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStaff();
//   }, []);

//   const handleDelete = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this staff record?")) return;
//     try {
//       await fetch(`/api/staff/${id}`, { method: "DELETE" });
//       setStaff((prev) => prev.filter((staff) => staff.id !== id));
//     } catch (err) {
//       console.error("Failed to delete staff:", err);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
//         <p className="text-blue-700 text-lg font-medium animate-pulse">
//           Loading staff records...
//         </p>
//       </div>
//     );

//   if (staff.length === 0)
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 text-center">
//         <Image
//             src="/storemaster.svg"
//             alt="Vergold Logo"
//             width={60}
//             height={60}
//           className="h-40 mb-6 opacity-80"
//         />
//         <h2 className="text-2xl font-semibold text-gray-700 mb-2">
//           No Staff Records Yet
//         </h2>
//         <p className="text-gray-500 mb-6">
//           Start by adding your first staff record to get started.
//         </p>
//         <Link
//           href="/staff/new"
//           className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
//         >
//           + Add Staff
//         </Link>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
//       {/* Header Section */}
//       <header className="flex flex-col sm:flex-row justify-between items-center bg-white/70 backdrop-blur-md p-6 sm:p-8 border-b border-blue-100 shadow-sm">
//         <div className="flex items-center gap-4 mb-4 sm:mb-0">
//           <Image
//             src="/storemaster.svg"
//             alt="Vergold Logo"
//             width={60}
//             height={60}
//             className="h-14 w-14 rounded-full border border-blue-200 shadow-sm"
//           />
//           <div>
//             <h1 className="text-3xl font-bold text-blue-700">
//               Staff Records
//             </h1>
//             <p className="text-gray-500 text-sm">
//               Manage and monitor your employees efficiently
//             </p>
//           </div>
//         </div>

//         <Link
//           href="/staff/new"
//           className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
//         >
//           + Add Staff
//         </Link>
//       </header>

//       {/* Table Section */}
//       <main className="p-6 sm:p-10">
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-blue-100">
//           <StaffTable staff={staff} onDelete={handleDelete} />
//         </div>
//       </main>
//     </div>
//   );
// }



// src/app/staff/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStaffList } from '@/hooks/useStaff';
import { staffApi } from '@/hooks/useStaff';
import Image from 'next/image';
import { Search } from 'lucide-react';
// import SearchFlter from '@/components/SearchFlter';

export default function StaffListPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    department: '',
    role: '',
    status: ''
  });

  const { staff, pagination, isLoading, isError, error, mutate } = useStaffList(filters);

  useEffect(() => {
    if (isError) {
      console.error('Staff List Error Details:', isError);
    }
  }, [isError, error]);

  if (isLoading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Loading staff...</span>
    </div>
  );

  // FIXED VERSION:
  if (isError) return (
    <div className="w-full flex justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-red-200">

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3m0 4h.01M4.93 4.93l14.14 14.14M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-lg md:text-xl font-semibold text-red-800">
            Error Loading Staff
          </h2>
        </div>

        {/* Error Message */}
        <p className="text-sm text-red-600 leading-relaxed mb-4 break-words">
          {error?.message || error || "An unexpected error occurred."}
        </p>

        {/* Login CTA */}
        <Link
          href="/auth/login"
          className="w-full block text-center py-2.5 rounded-lg bg-red-600 text-white font-medium text-sm transition-all duration-150 hover:bg-red-700 active:scale-[0.98]"
        >
          Go to Login
        </Link>

        {/* Decorative bottom bar */}
        <div className="mt-4 text-center text-xs text-red-400">
          Please authenticate again to regain access.
        </div>

      </div>
    </div>
  );

  const handleDeactivate = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this staff member?')) return;

    try {
      await staffApi.deactivate(id);
      mutate(); // Refresh the list
      alert('Staff deactivated successfully');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to deactivate staff');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await staffApi.activate(id);
      mutate();
      alert('Staff activated successfully');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to activate staff');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-blue-700 font-bold">Staff Management</h1>
        <Link
          href="/staff/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Staff
        </Link>
      </div>

      {/* Filters */}
      {/* <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
            className="border-2 bg-blue-50 border-blue-900 text-blue-900 rounded-lg px-3 py-2"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            className="border-2 bg-blue-50 border-blue-900 text-blue-900 rounded-lg px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select> */}
      {/* Add department and role filters when you have the data */}
      {/* </div>
      </div> */}

      <div className="w-full bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-100">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 tracking-wide">
            Filter Staff Records
          </h3>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Search Input */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-blue-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M16.65 10.35a6.3 6.3 0 11-12.6 0 6.3 6.3 0 0112.6 0z"
                />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))
              }
              className="w-full pl-10 pr-3 py-2 bg-blue-50 border-2 border-blue-900 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-700 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))
              }
              className="w-full px-3 py-2 bg-blue-50 border-2 border-blue-900 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-700 transition-all"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Future Filters Placeholder */}
          <div className="hidden lg:block">
            <div className="w-full h-full bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm italic">
              Department (coming soon)
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="w-full h-full bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm italic">
              Role (coming soon)
            </div>
          </div>

        </div>
      </div>
      {/* <SearchFlter /> */}

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">

        {/* Responsive wrapper */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-max md:min-w-full table-auto">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {staff?.map((staffMember) => (
                <tr key={staffMember.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        {staffMember.profilePhoto ? (
                          <Image
                            width={50}
                            height={50}
                            className="h-10 w-10 object-cover rounded-full"
                            src={staffMember.profilePhoto}
                            alt=""
                          />
                        ) : (
                          <span className="text-gray-600 font-medium">
                            {staffMember.firstName[0]}{staffMember.lastName[0]}
                          </span>
                        )}
                      </div>

                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {staffMember.firstName} {staffMember.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{staffMember.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staffMember.role.name}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staffMember.department.name}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md ${staffMember.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {staffMember.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/staff/${staffMember.id}`}
                      className="bg-blue-600 rounded-md px-4 py-2 text-white hover:text-blue-100"
                    >
                      View
                    </Link>

                    <Link
                      href={`/staff/${staffMember.id}/edit`}
                      className="bg-indigo-600 rounded-md px-4 py-2 text-white hover:text-indigo-100"
                    >
                      Edit
                    </Link>

                    {staffMember.status === "ACTIVE" ? (
                      <button
                        onClick={() => handleDeactivate(staffMember.id)}
                        className="bg-red-600 rounded-md px-4 py-2 text-white hover:text-red-100"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(staffMember.id)}
                        className="bg-green-600 rounded-md px-4 py-2 text-white hover:text-green-100"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Pagination */}
      {pagination && (
        <div className="bg-white px-4 py-4 flex items-center justify-between border-t border-gray-200 shadow-sm rounded-b-lg sm:px-6 mt-4">

          {/* Pagination Container */}
          <div className="flex flex-col sm:flex-row sm:items-center w-full justify-center space-y-3 sm:space-y-0">

            {/* Page Info Text */}
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-800">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">
                {pagination.total}
              </span>{" "}
              staff
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-1">

              {/* Previous Button */}
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
              >
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter(
                    (pageNum) =>
                      pageNum === 1 ||
                      pageNum === pagination.pages ||
                      Math.abs(pageNum - pagination.page) <= 1
                  )
                  .map((pageNum, idx, arr) => (
                    <div key={pageNum} className="flex items-center">
                      {/* Ellipsis */}
                      {idx > 0 && pageNum - arr[idx - 1] > 1 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}

                      {/* Page Number Button */}
                      <button
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, page: pageNum }))
                        }
                        className={`px-3 py-2 rounded-lg border transition ${pagination.page === pageNum
                            ? "bg-blue-600 text-white border-blue-600 shadow"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                      >
                        {pageNum}
                      </button>
                    </div>
                  ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <svg
                  className="h-4 w-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}