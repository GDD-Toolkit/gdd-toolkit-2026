import { useState } from "react";
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tell us about yourself</DialogTitle>
          <DialogDescription>
            A few quick questions help us tailor the toolkit to your work. If you skip for now,
            we'll ask again on your next visit.
          </DialogDescription>
        </DialogHeader>
        <ProfileForm key={user.documentId} user={user} variant="onboarding" onCancel={dismiss} />
      </DialogContent>
    </Dialog>
  );
}
