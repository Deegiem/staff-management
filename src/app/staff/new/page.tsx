import Link from "next/link";
import StaffForm from "@/components/StaffForm";

export default function NewStaffPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-8 sm:p-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-blue-700">
              Add New Staff
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Fill in the details below to create a new staff record.
            </p>
          </div>

          <Link
            href="/staff"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base transition-colors duration-200"
          >
            ← Back to Staff
          </Link>
        </div>

        {/* Staff Form */}
        <StaffForm />
      </div>
    </div>
  );
}
