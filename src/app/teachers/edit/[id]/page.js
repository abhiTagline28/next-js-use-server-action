"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Loader2 } from "lucide-react";
import { getTeacherById, updateTeacher } from "../../actions";

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTeacher();
  }, []);

  const fetchTeacher = async () => {
    try {
      const result = await getTeacherById(params.id);
      if (result.success) {
        setTeacher(result.data);
      } else {
        console.error("Failed to fetch teacher:", result.error);
        router.push("/teachers");
      }
    } catch (error) {
      console.error("Error fetching teacher:", error);
      router.push("/teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setUpdating(true);
    setErrors({});

    try {
      const result = await updateTeacher(params.id, formData);
      if (result.success) {
        router.push("/teachers");
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: "An error occurred while updating the teacher" });
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

    if (!formData.get("subject")?.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.get("qualification")?.trim()) {
      newErrors.qualification = "Qualification is required";
    }

    const experience = parseInt(formData.get("experience"));
    if (
      formData.get("experience") &&
      (isNaN(experience) || experience < 0 || experience > 50)
    ) {
      newErrors.experience = "Experience must be between 0 and 50 years";
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!teacher) {
    return null;
  }

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
          <h1 className="text-3xl font-bold text-white-900">Edit Teacher</h1>
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
                  defaultValue={teacher.name}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter teacher name"
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
                  defaultValue={teacher.email}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  defaultValue={teacher.subject}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.subject ? "border-red-500" : "border-gray-300"
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
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
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
                  defaultValue={teacher.qualification}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.qualification ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., M.Ed, B.Sc, Ph.D"
                />
                {errors.qualification && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.qualification}
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
                  defaultValue={teacher.experience || ""}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.experience ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter years of experience"
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experience}
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
                  defaultValue={teacher.phone || ""}
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
                defaultValue={teacher.office || ""}
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
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Teacher"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
