import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata = {
  title: "School Management System",
  description:
    "Comprehensive school management platform for students, teachers, peons, and guards",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
