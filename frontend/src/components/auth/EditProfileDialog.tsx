import { useState } from "react";
import { Pencil } from "lucide-react";
import { EDITORIAL_SERIF_STYLE } from "@/components/editorial/EditorialPagePrimitives";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { UserProfile } from "@/types/auth";
import { ProfileForm } from "./ProfileForm";

interface EditProfileDialogProps {
  user: UserProfile;
  /** "hero" renders a warm-cream CTA for the dark forest editorial hero. */
  variant?: "outline" | "hero";
}

/** "Edit profile" button that opens the onboarding questions prefilled with the user's answers. */
export function EditProfileDialog({
  user,
  variant = "outline",
}: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "hero" ? (
          <Button className="h-10 cursor-pointer rounded-full bg-[#E9E6B2] px-5 text-sm font-semibold text-[#202B20] shadow-sm hover:bg-[#f2efbf] focus-visible:ring-[#E9E6B2]">
            <Pencil />
            Edit profile
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-9 cursor-pointer rounded-full border-[1.5px] border-[#94B985] bg-white px-4 font-semibold text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8] hover:text-[#202B20]"
          >
            <Pencil />
            Edit profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-0 ring-0 shadow-xl sm:max-w-lg">
        <div
          aria-hidden="true"
          className="h-1.5 w-full bg-gradient-to-r from-[#3F673C] via-[#187347] to-[#94B985]"
        />
        <div className="space-y-5 p-6">
          <DialogHeader className="pr-8 text-left">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
              GDD Toolkit · Member Profile
            </p>
            <DialogTitle
              className="text-2xl font-semibold tracking-tight text-[#202B20]"
              style={EDITORIAL_SERIF_STYLE}
            >
              Edit profile
            </DialogTitle>
            <DialogDescription className="text-sm text-[#596556]">
              Update your details and preferences. Changes apply as soon as you
              save.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            user={user}
            variant="edit"
            onCancel={close}
            onSaved={close}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
