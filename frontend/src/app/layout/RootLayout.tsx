import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { OnboardingDialog } from "@/components/auth/OnboardingDialog";
import { Toaster } from "@/components/ui/sonner";
import { ScrollProgressBar } from "@/components/editorial/EditorialPagePrimitives";

function ScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ScrollToTopOnNavigate />
      <ScrollProgressBar />
      <div className="flex min-h-screen w-full flex-col bg-white text-[#202B20]">
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
