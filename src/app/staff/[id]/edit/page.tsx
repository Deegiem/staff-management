import Link from "next/link";

type Staff = {
  id: number;
  name: string;
  email: string;
  position: string;
  createdAt: string;
};

async function getStaff(id: number): Promise<Staff | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function StaffDetailPage({ params }: { params: { id: string } }) {
  const staffId = Number(params.id);
  const staffData = await getStaff(staffId);

  if (!staffData) {
    return <p className="text-center mt-10 text-red-500">Staff not found</p>;
  }

  return (
    <div className="p-6 text-center">
        <div className="bg-blue-950 p-6 rounded-lg shadow-md inline-block w-full text-left">
            <h1 className="text-2xl font-bold">Name: {staffData.name}</h1>
            <p>Email: {staffData.email}</p>
            <p>Position: {staffData.position}</p>
            <p className="text-sm text-gray-500 mt-4">
              Created at: {new Date(staffData.createdAt).toLocaleString()}
            </p>
        </div>
        <Link 
            className="mt-6 inline-block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            href={`/staff/${staffId}`}
        >
            Edit details
        </Link>
    </div>
  );
}
