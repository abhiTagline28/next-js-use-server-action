import Navigation from "@/components/Navigation";

export const metadata = {
  title: "School Management System",
  description:
    "Comprehensive school management platform for students, teachers, peons, and guards",
};

export default function DashboardLayout({
  children,
  teachers,
  students,
  peons,
  guards,
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      {children}
      {/* Parallel Route Tables - Only render when children is the home page */}

      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teachers}
          {students}
          {peons}
          {guards}
        </div>
      </div>
    </div>
  );
}
