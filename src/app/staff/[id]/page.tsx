"use client"; // <-- MUST have this for useState/useEffect
import { useState, useEffect } from "react";
import StaffForm from "@/components/StaffForm";
import { useRouter } from "next/navigation";

type Staff = {
  id: number;
  name: string;
  email: string;
  position: string;
};

type Props = {
  params: { id: string };
};

export default function EditStaffPage({ params }: Props) {
  const staffId = Number(params.id);
  const [staffData, setStaffData] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStaff = async () => {
      const res = await fetch(`/api/staff/${staffId}`);
      const data = await res.json();
      setStaffData(data);
      setLoading(false);
    };
    fetchStaff();
  }, [staffId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!staffData) return <p className="text-center mt-10 text-red-500">Staff not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Staff</h1>
      <StaffForm initialData={staffData} staffId={staffId} />
    </div>
  );
}
