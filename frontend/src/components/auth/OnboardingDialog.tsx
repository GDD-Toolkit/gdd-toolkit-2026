import { useState } from "react";
import { EDITORIAL_SERIF_STYLE } from "@/components/editorial/EditorialPagePrimitives";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { ProfileForm } from "./ProfileForm";

/**
 * Asks new users the profile questions from shared/types/Users.ts. Opens for
 * any signed-in user who has not finished them, whichever way they signed up,
 * and comes back on every visit until the answers are saved.
 */
export function OnboardingDialog() {
  const { user, isAuthenticated, authModal } = useAuth();
  // "Later" hides the prompt for this page load only; the next visit asks again.
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);

  if (!user) return null;

  const open =
    isAuthenticated &&
    user.onboardingComplete !== true &&
    !authModal.open &&
    dismissedFor !== user.documentId;
  const dismiss = () => setDismissedFor(user.documentId);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && dismiss()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-0 ring-0 shadow-xl sm:max-w-lg">
        <div
          aria-hidden="true"
          className="h-1.5 w-full bg-gradient-to-r from-[#3F673C] via-[#187347] to-[#94B985]"
        />
        <div className="space-y-5 p-6">
          <DialogHeader className="pr-8 text-left">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
              Welcome to GDD Toolkit
            </p>
            <DialogTitle
              className="text-2xl font-semibold tracking-tight text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              Tell us about yourself
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-[#596556]">
              A few quick questions help us tailor the toolkit to your work. If
              you skip for now, we&apos;ll ask again on your next visit.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            key={user.documentId}
            user={user}
            variant="onboarding"
            onCancel={dismiss}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
