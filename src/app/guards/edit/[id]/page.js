"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, Loader2 } from "lucide-react";
import { getGuardById, updateGuard } from "../../actions";

export default function EditGuardPage() {
  const router = useRouter();
  const params = useParams();
  const [guard, setGuard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchGuard();
  }, []);

  const fetchGuard = async () => {
    try {
      const result = await getGuardById(params.id);
      if (result.success) {
        setGuard(result.data);
      } else {
        console.error("Failed to fetch guard:", result.error);
        router.push("/guards");
      }
    } catch (error) {
      console.error("Error fetching guard:", error);
      router.push("/guards");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setUpdating(true);
    setErrors({});

    try {
      const result = await updateGuard(params.id, formData);
      if (result.success) {
        router.push("/guards");
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: "An error occurred while updating the guard" });
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

    if (!formData.get("post")?.trim()) {
      newErrors.post = "Post is required";
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!guard) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/guards"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Shield className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-white-900">Edit Guard</h1>
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
                  defaultValue={guard.name}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter guard name"
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
                  defaultValue={guard.email}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
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
                  htmlFor="post"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Post *
                </label>
                <select
                  id="post"
                  name="post"
                  defaultValue={guard.post}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.post ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Post</option>
                  <option value="Main Gate">Main Gate</option>
                  <option value="Back Gate">Back Gate</option>
                  <option value="Parking">Parking</option>
                  <option value="Building A">Building A</option>
                  <option value="Building B">Building B</option>
                  <option value="Library">Library</option>
                  <option value="Cafeteria">Cafeteria</option>
                </select>
                {errors.post && (
                  <p className="mt-1 text-sm text-red-600">{errors.post}</p>
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
                  defaultValue={guard.shift}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  defaultValue={guard.phone || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter phone number"
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
                defaultValue={guard.address || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter address"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                href="/guards"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Guard"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
