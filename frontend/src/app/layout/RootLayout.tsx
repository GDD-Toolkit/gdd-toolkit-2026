import { Outlet } from "react-router-dom";   // for nested routes
import Navbar from "@/components/layout/navbar"; // adjust path if lowercase
import Footer from "@/components/layout/footer"; // adjust path if lowercase

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col w-full bg-white text-gray-900">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

