import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EDITORIAL_SERIF_STYLE } from "@/components/editorial/EditorialPagePrimitives";
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
      navigate(location.pathname + location.search, {
        replace: true,
        state: null,
      });
    }
  }, [location, navigate, openAuthModal]);

  // Start from the sign-in form every time the dialog opens.
  useEffect(() => {
    if (!authModal.open) setSignInView("form");
  }, [authModal.open]);

  const isSignUp = authModal.tab === "sign-up";
  const isForgot = !isSignUp && signInView === "forgot";

  const eyebrow = isForgot
    ? "GDD Toolkit · Password Recovery"
    : isSignUp
      ? "GDD Toolkit · Join Free"
      : "GDD Toolkit · Member Access";
  const title = isForgot
    ? "Reset your password"
    : isSignUp
      ? "Create your account"
      : "Welcome back";
  const description = isForgot
    ? "We'll email you a link to choose a new one."
    : isSignUp
      ? "Save tools and grants, and run the planning wizard."
      : "Sign in to access your saved tools and grants.";

  return (
    <Dialog
      open={authModal.open}
      onOpenChange={(open) => !open && closeAuthModal()}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-0 ring-0 shadow-xl sm:max-w-md">
        <div
          aria-hidden="true"
          className="h-1.5 w-full bg-gradient-to-r from-[#3F673C] via-[#187347] to-[#94B985]"
        />
        <div className="space-y-5 p-6">
          <DialogHeader className="pr-8 text-left">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
              {eyebrow}
            </p>
            <DialogTitle
              className="text-2xl font-semibold tracking-tight text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#596556]">
              {description}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={authModal.tab}
            onValueChange={(tab) => {
              setSignInView("form");
              openAuthModal(tab as AuthModalTab);
            }}
          >
            <TabsList className="h-10 w-full rounded-full border border-[#B2C9A8] bg-[#F2F6EF] p-1">
              <TabsTrigger
                value="sign-in"
                className="flex-1 rounded-full text-xs font-semibold text-[#394838] transition-all hover:text-[#202B20] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3F673C] data-[state=active]:to-[#187347] data-[state=active]:text-white data-[state=active]:shadow-xs data-active:bg-gradient-to-r data-active:from-[#3F673C] data-active:to-[#187347] data-active:text-white"
              >
                Sign in
              </TabsTrigger>
              <TabsTrigger
                value="sign-up"
                className="flex-1 rounded-full text-xs font-semibold text-[#394838] transition-all hover:text-[#202B20] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3F673C] data-[state=active]:to-[#187347] data-[state=active]:text-white data-[state=active]:shadow-xs data-active:bg-gradient-to-r data-active:from-[#3F673C] data-active:to-[#187347] data-active:text-white"
              >
                Sign up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in" className="mt-5 space-y-4">
              {isForgot ? (
                <ForgotPasswordForm onBack={() => setSignInView("form")} />
              ) : (
                <>
                  <LoginForm onForgotPassword={() => setSignInView("forgot")} />
                  <SocialAuthButtons />
                </>
              )}
            </TabsContent>
            <TabsContent value="sign-up" className="mt-5 space-y-4">
              <RegisterForm />
              <SocialAuthButtons />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
