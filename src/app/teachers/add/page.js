"use client";

import { useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { createTeacher } from "../actions";
import SubmitButton from "../SubmitButton";
import { useEffect } from "react";

// Initial state for useActionState
const initialState = {
  message: null,
  errors: {},
  success: false,
};

export default function AddTeacherPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(createTeacher, initialState);

  // Optimistic update for better UX
  const [optimisticTeachers, addOptimisticTeacher] = useOptimistic(
    [],
    (state, newTeacher) => [...state, newTeacher]
  );

  // Handle form submission with optimistic updates
  const handleFormSubmit = async (formData) => {
    // Create optimistic teacher data
    const optimisticTeacher = {
      id: `temp-${Date.now()}`,
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      qualification: formData.get("qualification"),
      experience: formData.get("experience")
        ? parseInt(formData.get("experience"))
        : null,
      phone: formData.get("phone") || null,
      office: formData.get("office") || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOptimistic: true, // Flag to identify optimistic data
    };

    // Add optimistic update
    addOptimisticTeacher(optimisticTeacher);

    // Submit the form
    formAction(formData);
  };

  // Redirect on success using useEffect to avoid setState during render
  useEffect(() => {
    if (state.success) {
      router.push("/teachers");
    }
  }, [state.success, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/teachers"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <GraduationCap className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-white-900">Add New Teacher</h1>
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

        {/* Optimistic Teachers Display */}
        {optimisticTeachers.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-2">
              Optimistic Preview:
            </h3>
            <div className="space-y-2">
              {optimisticTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <div>
                    <span className="font-medium">{teacher.name}</span>
                    <span className="text-gray-500 ml-2">
                      ({teacher.email})
                    </span>
                  </div>
                  {teacher.isOptimistic && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    state.errors?.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter teacher name"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    state.errors?.subject ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Literature">Literature</option>
                  <option value="Art">Art</option>
                  <option value="Music">Music</option>
                  <option value="Physical Education">Physical Education</option>
                </select>
                {state.errors?.subject && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="qualification"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Qualification *
                </label>
                <input
                  type="text"
                  id="qualification"
                  name="qualification"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    state.errors?.qualification
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="e.g., M.Ed, B.Sc, Ph.D"
                />
                {state.errors?.qualification && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.qualification}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Experience (years)
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  min="0"
                  max="50"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    state.errors?.experience
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter years of experience"
                />
                {state.errors?.experience && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.experience}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="office"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Office
              </label>
              <input
                type="text"
                id="office"
                name="office"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter office location"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                href="/teachers"
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
