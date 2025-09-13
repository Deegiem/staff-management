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
    <table className="w-full mt-6 border ">
      <thead>
        <tr className="bg-blue-900">
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Position</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {staff.map((staff) => (
          <tr key={staff.id}>
            <td className="p-2 border">{staff.name}</td>
            <td className="p-2 border">{staff.email}</td>
            <td className="p-2 border">{staff.position}</td>
            <td className="p-2 border space-x-4">
              {/* Edit button */}
              <Link
                href={`/staff/${staff.id}/edit`}
                className="px-3 py-1 bg-blue-600 text-white rounded lg hover:bg-blue-700"
              >
                Edit
              </Link>

              {/* Delete button with confirmation */}
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${staff.name}?`)) {
                    onDelete(staff.id);
                  }
                }}
                className="px-3 py-1 bg-red-600 text-white rounded lg hover:bg-red-700"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
