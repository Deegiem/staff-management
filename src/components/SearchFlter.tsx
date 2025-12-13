import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function StaffFilters({ filters, setFilters }) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchInput, 350);

  // Update filters only when debounced search updates
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearch,
      page: 1,
    }));
  }, [debouncedSearch]);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* SEARCH INPUT */}
        <div className="relative">
          {/* search icon */}
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-blue-50 border-2 border-blue-900 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-700 transition-all"
          />

          {/* X CLEAR BUTTON */}
          {searchInput.length > 0 && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-3 text-blue-900 hover:text-blue-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* STATUS FILTER */}
        <div>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: e.target.value,
                page: 1,
              }))
            }
            className="w-full px-3 py-2 bg-blue-50 border-2 border-blue-900 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-700 transition-all"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

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
  );
}
