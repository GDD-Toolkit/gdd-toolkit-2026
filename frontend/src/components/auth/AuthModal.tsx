import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import type { AuthModalTab } from "@/context/auth-context";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { SocialAuthButtons } from "./SocialAuthButtons";

/** Sign in / sign up dialog. Mounted once in the root layout; opened via useAuth(). */
export function AuthModal() {
  const { authModal, openAuthModal, closeAuthModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // ProtectedRoute redirects here with { openAuthModal: true } in location state.
  useEffect(() => {
    const state = location.state as { openAuthModal?: boolean } | null;
    if (state?.openAuthModal) {
      openAuthModal("sign-in");
      navigate(location.pathname + location.search, { replace: true, state: null });
    }
  }, [location, navigate, openAuthModal]);

  const isSignUp = authModal.tab === "sign-up";

  return (
    <Dialog open={authModal.open} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Create your account" : "Welcome back"}</DialogTitle>
          <DialogDescription>
            {isSignUp
              ? "Save tools and grants, and run the planning wizard."
              : "Sign in to access your saved tools and grants."}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={authModal.tab} onValueChange={(tab) => openAuthModal(tab as AuthModalTab)}>
          <TabsList className="w-full">
            <TabsTrigger value="sign-in" className="flex-1">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="sign-up" className="flex-1">
              Sign up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in" className="mt-4 space-y-4">
            <LoginForm />
            <SocialAuthButtons />
          </TabsContent>
          <TabsContent value="sign-up" className="mt-4 space-y-4">
            <RegisterForm />
            <SocialAuthButtons />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
