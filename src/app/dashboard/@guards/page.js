"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Loader2 } from "lucide-react";
import { getGuards } from "@/app/guards/actions";

export default function GuardsTable() {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const result = await getGuards();
        if (result.success) {
          setGuards(result.data.slice(0, 3)); // Show only 3 results
        } else {
          console.error("Failed to fetch guards:", result.error);
        }
      } catch (error) {
        console.error("Error fetching guards:", error);
      } finally {
        setLoading(false);
      }
    }, 8000); // 8 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">Guards</h3>
          </div>
          <Link
            href="/guards"
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            View All →
          </Link>
        </div>

        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading guards...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">Guards</h3>
        </div>
        <Link
          href="/guards"
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          View All →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {guards.map((guard) => (
              <tr key={guard.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {guard.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {guard.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
