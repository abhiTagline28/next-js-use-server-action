import { Users, TrendingUp, Clock, AlertTriangle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to School Management System
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Manage students, teachers, peons, and guards efficiently with our
            comprehensive management platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <a
            href="/students"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500 text-white">
                <Users className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-800">3</p>
              </div>
            </div>
          </a>

          <a
            href="/teachers"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500 text-white">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">
                  Total Teachers
                </p>
                <p className="text-2xl font-bold text-gray-800">3</p>
              </div>
            </div>
          </a>

          <a
            href="/peons"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-500 text-white">
                <Clock className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Peons</p>
                <p className="text-2xl font-bold text-gray-800">3</p>
              </div>
            </div>
          </a>

          <a
            href="/guards"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-500 text-white">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">
                  Total Guards
                </p>
                <p className="text-2xl font-bold text-gray-800">3</p>
              </div>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}
