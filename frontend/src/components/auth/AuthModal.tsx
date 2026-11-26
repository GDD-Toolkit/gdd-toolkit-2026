import { useEffect, useState } from "react";
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
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { SocialAuthButtons } from "./SocialAuthButtons";

type SignInView = "form" | "forgot";

/** Sign in / sign up dialog. Mounted once in the root layout; opened via useAuth(). */
export function AuthModal() {
  const { authModal, openAuthModal, closeAuthModal } = useAuth();
  const [signInView, setSignInView] = useState<SignInView>("form");
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

  // Start from the sign-in form every time the dialog opens.
  useEffect(() => {
    if (!authModal.open) setSignInView("form");
  }, [authModal.open]);

  const isSignUp = authModal.tab === "sign-up";
  const isForgot = !isSignUp && signInView === "forgot";

  const title = isForgot ? "Reset your password" : isSignUp ? "Create your account" : "Welcome back";
  const description = isForgot
    ? "We'll email you a link to choose a new one."
    : isSignUp
      ? "Save tools and grants, and run the planning wizard."
      : "Sign in to access your saved tools and grants.";

  return (
    <Dialog open={authModal.open} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Tabs
          value={authModal.tab}
          onValueChange={(tab) => {
            setSignInView("form");
            openAuthModal(tab as AuthModalTab);
          }}
        >
          <TabsList className="w-full">
            <TabsTrigger value="sign-in" className="flex-1">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="sign-up" className="flex-1">
              Sign up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in" className="mt-4 space-y-4">
            {isForgot ? (
              <ForgotPasswordForm onBack={() => setSignInView("form")} />
            ) : (
              <>
                <LoginForm onForgotPassword={() => setSignInView("forgot")} />
                <SocialAuthButtons />
              </>
            )}
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
