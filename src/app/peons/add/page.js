"use client";

import { useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";
import { createPeon } from "../actions";
import SubmitButton from "../SubmitButton";
import { useEffect } from "react";

// Initial state for useActionState
const initialState = {
  message: null,
  errors: {},
  success: false,
};

export default function AddPeonPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(createPeon, initialState);

  // Optimistic update for better UX
  const [optimisticPeons, addOptimisticPeon] = useOptimistic(
    [],
    (state, newPeon) => [...state, newPeon]
  );

  // Handle form submission with optimistic updates
  const handleFormSubmit = async (formData) => {
    // Create optimistic peon data
    const optimisticPeon = {
      id: `temp-${Date.now()}`,
      name: formData.get("name"),
      email: formData.get("email"),
      department: formData.get("department"),
      phone: formData.get("phone") || null,
      address: formData.get("address") || null,
      salary: formData.get("salary")
        ? parseFloat(formData.get("salary"))
        : null,
      shift: formData.get("shift") || "Morning",
      responsibilities: formData.get("responsibilities")
        ? formData
            .get("responsibilities")
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOptimistic: true, // Flag to identify optimistic data
    };

    // Add optimistic update
    addOptimisticPeon(optimisticPeon);

    // Submit the form
    formAction(formData);
  };

  // Redirect on success using useEffect to avoid setState during render
  useEffect(() => {
    if (state.success) {
      router.push("/peons");
    }
  }, [state.success, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/peons"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Wrench className="w-8 h-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-white-900">Add New Peon</h1>
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

        {/* Optimistic Peons Display */}
        {optimisticPeons.length > 0 && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="text-sm font-medium text-orange-800 mb-2">
              Optimistic Preview:
            </h3>
            <div className="space-y-2">
              {optimisticPeons.map((peon) => (
                <div
                  key={peon.id}
                  className="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <div>
                    <span className="font-medium">{peon.name}</span>
                    <span className="text-gray-500 ml-2">({peon.email})</span>
                  </div>
                  {peon.isOptimistic && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    state.errors?.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter peon name"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
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
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    state.errors?.department
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Department</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Custodial">Custodial</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Grounds">Grounds</option>
                  <option value="Kitchen">Kitchen</option>
                </select>
                {state.errors?.department && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.department}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="shift"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Shift
                </label>
                <select
                  id="shift"
                  name="shift"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Salary
                </label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  min="0"
                  step="1000"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    state.errors?.salary ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter salary"
                />
                {state.errors?.salary && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.salary}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter address"
              />
            </div>

            <div>
              <label
                htmlFor="responsibilities"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Responsibilities (comma-separated)
              </label>
              <input
                type="text"
                id="responsibilities"
                name="responsibilities"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Cleaning, Maintenance, Setup"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                href="/peons"
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
