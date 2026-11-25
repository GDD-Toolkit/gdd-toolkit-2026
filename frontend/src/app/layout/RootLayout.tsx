import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { OnboardingDialog } from "@/components/auth/OnboardingDialog";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export default function RootLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <AuthProvider>
      <div
        className={cn(
          "flex min-h-screen w-full flex-col",
          isHome ? "bg-[#09090B] text-white" : "bg-white text-gray-900",
        )}
      >
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
