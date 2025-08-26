"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Loader2 } from "lucide-react";
import { getStudents } from "@/app/students/actions";

export default function StudentsTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const result = await getStudents();
        if (result.success) {
          setStudents(result.data.slice(0, 3)); // Show only 3 results
        } else {
          console.error("Failed to fetch students:", result.error);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }, 4000); // 4 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Students</h3>
          </div>
          <Link
            href="/students"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All →
          </Link>
        </div>

        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading students...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Students</h3>
        </div>
        <Link
          href="/students"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {student.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {student.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
