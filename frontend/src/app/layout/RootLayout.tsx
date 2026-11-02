import { Outlet } from "react-router-dom";   // for nested routes
import Navbar from "@/components/layout/navbar"; // adjust path if lowercase
import Footer from "@/components/layout/footer"; // adjust path if lowercase
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { OnboardingDialog } from "@/components/auth/OnboardingDialog";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col w-full bg-white text-gray-900">
        <Navbar />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
        <Footer />
      </div>
      <AuthModal />
      <OnboardingDialog />
      <Toaster />
    </AuthProvider>
  );
}

