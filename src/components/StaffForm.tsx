"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Staff = {
  id?: number;
  name: string;
  email: string;
  position: string;
};

type Props = {
  initialData?: Staff;
  staffId?: number;
};

export default function StaffForm({ initialData, staffId }: Props) {
  const [formData, setFormData] = useState<Staff>({
    name: "",
    email: "",
    position: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // populate form when editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = staffId ? `/api/staff/${staffId}` : "/api/staff";
      const method = staffId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save staff");

      router.push("/staff");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="border-2 p-2 w-full rounded-lg"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border-2 p-2 w-full rounded-lg"
        required
      />
      <input
        type="text"
        name="position"
        placeholder="Position"
        value={formData.position}
        onChange={handleChange}
        className="border-2 p-2 w-full rounded-lg"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white w-full p-2 px-4 py-2 rounded-lg"
        disabled={loading}
      >
        {loading ? "Saving..." : staffId ? "Update Staff" : "Add Staff"}
      </button>
    </form>
  );
}
