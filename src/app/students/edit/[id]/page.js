"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Loader2 } from "lucide-react";
import { getStudentById, updateStudent } from "../../actions";

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const result = await getStudentById(params.id);
      if (result.success) {
        setStudent(result.data);
      } else {
        console.error("Failed to fetch student:", result.error);
        router.push("/students");
      }
    } catch (error) {
      console.error("Error fetching student:", error);
      router.push("/students");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setUpdating(true);
    setErrors({});

    try {
      const result = await updateStudent(params.id, formData);
      if (result.success) {
        router.push("/students");
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: "An error occurred while updating the student" });
    } finally {
      setUpdating(false);
    }
  };

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.get("name")?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.get("email")?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get("email"))) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.get("grade")?.trim()) {
      newErrors.grade = "Grade is required";
    }

    const age = parseInt(formData.get("age"));
    if (formData.get("age") && (isNaN(age) || age < 5 || age > 25)) {
      newErrors.age = "Age must be between 5 and 25 years";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (validateForm(formData)) {
      await handleSubmit(formData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/students"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <User className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-white-900">Edit Student</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={student.name}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter student name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={student.email}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="grade"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Grade *
                </label>
                <select
                  id="grade"
                  name="grade"
                  defaultValue={student.grade}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.grade ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Grade</option>
                  <option value="1st Grade">1st Grade</option>
                  <option value="2nd Grade">2nd Grade</option>
                  <option value="3rd Grade">3rd Grade</option>
                  <option value="4th Grade">4th Grade</option>
                  <option value="5th Grade">5th Grade</option>
                  <option value="6th Grade">6th Grade</option>
                  <option value="7th Grade">7th Grade</option>
                  <option value="8th Grade">8th Grade</option>
                  <option value="9th Grade">9th Grade</option>
                  <option value="10th Grade">10th Grade</option>
                  <option value="11th Grade">11th Grade</option>
                  <option value="12th Grade">12th Grade</option>
                </select>
                {errors.grade && (
                  <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="5"
                  max="25"
                  defaultValue={student.age || ""}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.age ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter age"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={student.phone || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="parentName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Parent Name
                </label>
                <input
                  type="text"
                  id="parentName"
                  name="parentName"
                  defaultValue={student.parentName || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter parent name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows="3"
                defaultValue={student.address || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter address"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                href="/students"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Student"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
