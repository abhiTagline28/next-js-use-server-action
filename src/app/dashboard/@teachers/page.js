"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Loader2 } from "lucide-react";
import { getTeachers } from "@/app/teachers/actions";

export default function TeachersTable() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const result = await getTeachers();
        if (result.success) {
          setTeachers(result.data.slice(0, 3)); // Show only 3 results
        } else {
          console.error("Failed to fetch teachers:", result.error);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Teachers</h3>
          </div>
          <Link
            href="/teachers"
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            View All →
          </Link>
        </div>

        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading teachers...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Teachers</h3>
        </div>
        <Link
          href="/teachers"
          className="text-green-600 hover:text-green-800 text-sm font-medium"
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
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {teacher.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {teacher.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
