"use client";
import Link from "next/link";

type Staff = {
  id: number;
  name: string;
  email: string;
  position: string;
};

type StaffTableProps = {
  staff: Staff[];
  onDelete: (id: number) => void;
};

export default function StaffTable({ staff, onDelete }: StaffTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full text-sm text-left border border-blue-100 rounded-lg overflow-hidden">
        <thead className="bg-blue-50 text-blue-700 uppercase text-xs font-semibold tracking-wide">
          <tr >
            <th className="px-5 py-3 border-b border-blue-100">Name</th>
            <th className="px-5 py-3 border-b border-blue-100">Email</th>
            <th className="px-5 py-3 border-b border-blue-100">Position</th>
            <th className="px-5 py-3 border-b border-blue-100 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((staff, idx) => (
            <tr key={staff.id} className={`transition-all duration-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                } hover:bg-blue-100/50`}>
              <td className="px-5 py-3 border-b border-blue-100 text-gray-800 font-medium">{staff.name}</td>
              <td className="px-5 py-3 border-b border-blue-100 text-gray-800 font-medium break-words">{staff.email}</td>
              <td className="px-5 py-3 border-b border-blue-100 text-gray-800 font-medium">{staff.position}</td>
              <td className="px-5 py-3 border-b border-blue-100 text-gray-800 font-medium text-center space-x-2">
                {/* Edit button */}
                <Link
               href={`/staff/edit/${staff.id}`}
                  // href="/staff/edit"
                  className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View
                </Link>

                {/* Delete button with confirmation */}
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${staff.name}?`)) {
                      onDelete(staff.id);
                    }
                  }}
                  className="inline-block px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
