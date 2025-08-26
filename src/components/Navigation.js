"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, GraduationCap, Wrench, Shield, Home } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/students",
      label: "Students",
      icon: User,
      color: "text-blue-600",
    },
    {
      href: "/teachers",
      label: "Teachers",
      icon: GraduationCap,
      color: "text-green-600",
    },
    { href: "/peons", label: "Peons", icon: Wrench, color: "text-orange-600" },
    { href: "/guards", label: "Guards", icon: Shield, color: "text-red-600" },
  ];

  return (
    <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">School Management</h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? `bg-gray-600 ${item.color}`
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
