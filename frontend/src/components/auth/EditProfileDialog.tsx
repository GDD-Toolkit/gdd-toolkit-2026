import { useState } from "react";
import { Pencil } from "lucide-react";
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

/** "Edit profile" button that opens the onboarding questions prefilled with the user's answers. */
export function EditProfileDialog({ user }: { user: UserProfile }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil />
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your details and preferences. Changes apply as soon as you save.
          </DialogDescription>
        </DialogHeader>
        <ProfileForm user={user} variant="edit" onCancel={close} onSaved={close} />
      </DialogContent>
    </Dialog>
  );
}
