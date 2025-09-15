"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StaffTable from "@/components/StaffTable";

type Staff = {
  id: number;
  name: string;
  email: string;
  position: string;
};

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      const res = await fetch("/api/staff");
      const data = await res.json();
      setStaff(data);
      setLoading(false);
    };
    fetchStaff();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this staff?")) return;
    try {
      await fetch(`/api/staff/${id}`, { method: "DELETE" });
      setStaff((prev) => prev.filter((staff) => staff.id !== id));
    } catch (err) {
      console.error("Failed to delete staff:", err);
    }
  };


    if (staff.length === 0) {
      return (
        <div className="mt-10">
          <p className="text-white text-lg mb-4">No Staff Records Yet</p>
          <p className="text-gray-500 text-sm mb-4">
            Start by adding your first staff record.
          </p>
          <Link
            href="/staff/new"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Staff
          </Link>
        </div>
      );
    }

    if (loading) return <p>Loading staff records...</p>;


  return (
    <>
        <div className="p-6 flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-x-4">
                <img 
                    className="h-14 w-14 rounded-full"
                    src="https://media.licdn.com/dms/image/v2/D4D0BAQEperMwT0e2tg/company-logo_200_200/company-logo_200_200/0/1735659298870?e=1760572800&v=beta&t=XMzI6LcXPi3Exli9cASLiq7O5PKp1Ny2ksJk99glzic"
                    alt="Vergold staff Records" />
                <h1 className="text-2xl font-bold mb-4">Staff Records</h1>
            </div>
            <Link
                href="/staff/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
            + Add Staff
            </Link>
        </div>
        <div className="m-6 " >
            <StaffTable staff={staff} onDelete={handleDelete} />
        </div>
    </>
  );
}
