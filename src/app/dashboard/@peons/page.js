"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wrench, Loader2 } from "lucide-react";
import { getPeons } from "@/app/peons/actions";

export default function PeonsTable() {
  const [peons, setPeons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const result = await getPeons();
        if (result.success) {
          setPeons(result.data.slice(0, 3)); // Show only 3 results
        } else {
          console.error("Failed to fetch peons:", result.error);
        }
      } catch (error) {
        console.error("Error fetching peons:", error);
      } finally {
        setLoading(false);
      }
    }, 6000); // 6 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Wrench className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-800">Peons</h3>
          </div>
          <Link
            href="/peons"
            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
          >
            View All →
          </Link>
        </div>

        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading peons...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Wrench className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-800">Peons</h3>
        </div>
        <Link
          href="/peons"
          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
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
            {peons.map((peon) => (
              <tr key={peon.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {peon.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {peon.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
