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
    <div className="mt-6 overflow-x-auto">
      <table className="w-full md:w-screen border border-collapse min-w-[400px]">
        <thead>
          <tr className="bg-blue-900 text-white text-left">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Position</th>
            <th className="p-3 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-[#030c27] text-gray-200">
          {staff.map((staff) => (
            <tr key={staff.id} className="hover:bg-blue-950 transition">
              <td className="p-3 border">{staff.name}</td>
              <td className="p-3 border break-words">{staff.email}</td>
              <td className="p-3 border">{staff.position}</td>
              <td className="p-3 border text-center space-x-2">
                {/* Edit button */}
                <Link
                  href={`/staff/edit/${staff.id}`}
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
