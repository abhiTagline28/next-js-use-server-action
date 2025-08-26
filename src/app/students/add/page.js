"use client";

import { useOptimistic, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { createStudent } from "./actions";
import SubmitButton from "./SubmitButton";

// Initial state for useActionState
const initialState = {
  message: null,
  errors: {},
  success: false,
};

export default function AddStudentPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(createStudent, initialState);

  // Optimistic update for better UX
  const [optimisticStudents, addOptimisticStudent] = useOptimistic(
    [],
    (state, newStudent) => [...state, newStudent]
  );

  // Handle form submission with optimistic updates
  const handleFormSubmit = async (formData) => {
    // Create optimistic student data
    const optimisticStudent = {
      id: `temp-${Date.now()}`,
      name: formData.get("name"),
      email: formData.get("email"),
      grade: formData.get("grade"),
      age: formData.get("age") ? parseInt(formData.get("age")) : null,
      phone: formData.get("phone") || null,
      address: formData.get("address") || null,
      gpa: formData.get("gpa") ? parseFloat(formData.get("gpa")) : null,
      subjects: formData.get("subjects")
        ? formData
            .get("subjects")
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOptimistic: true, // Flag to identify optimistic data
    };

    // Add optimistic update
    addOptimisticStudent(optimisticStudent);

    // Submit the form
    formAction(formData);
  };

  // Redirect on success using useEffect to avoid setState during render
  useEffect(() => {
    if (state.success) {
      router.push("/students");
    }
  }, [state.success, router]);

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
          <h1 className="text-3xl font-bold text-white-900">Add New Student</h1>
        </div>

        {/* Success/Error Messages */}
        {state.message && (
          <div
            className={`mb-4 p-3 border rounded ${
              state.success
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            }`}
          >
            {state.message}
          </div>
        )}

        {/* Optimistic Students Display */}
        {optimisticStudents.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Optimistic Preview:
            </h3>
            <div className="space-y-2">
              {optimisticStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <div>
                    <span className="font-medium">{student.name}</span>
                    <span className="text-gray-500 ml-2">
                      ({student.email})
                    </span>
                  </div>
                  {student.isOptimistic && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Creating...
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form action={handleFormSubmit} className="space-y-6 text-black">
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    state.errors?.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter student name"
                />
                {state.errors?.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.name}
                  </p>
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    state.errors?.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter email address"
                />
                {state.errors?.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.email}
                  </p>
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    state.errors?.grade ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Grade</option>
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
                {state.errors?.grade && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.grade}
                  </p>
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    state.errors?.age ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter age"
                />
                {state.errors?.age && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.age}
                  </p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="gpa"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  GPA
                </label>
                <input
                  type="number"
                  id="gpa"
                  name="gpa"
                  step="0.01"
                  min="0"
                  max="4"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    state.errors?.gpa ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter GPA"
                />
                {state.errors?.gpa && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.gpa}
                  </p>
                )}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter address"
              />
            </div>

            <div>
              <label
                htmlFor="subjects"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subjects (comma-separated)
              </label>
              <input
                type="text"
                id="subjects"
                name="subjects"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Math, Science, English"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                href="/students"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
