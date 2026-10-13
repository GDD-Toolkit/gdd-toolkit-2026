import { providerConnectUrl, RETURN_TO_KEY } from "@/api/auth";
import { Button } from "@/components/ui/button";

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.8-5.4 3.8-3.3 0-5.9-2.7-5.9-6s2.6-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.6 2.3 2.3 6.6 2.3 12S6.6 21.7 12 21.7c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}

export function SocialAuthButtons() {
  function continueWithGoogle() {
    try {
      sessionStorage.setItem(RETURN_TO_KEY, window.location.pathname + window.location.search);
    } catch {
      // Session storage unavailable; the callback falls back to the home page.
    }
    window.location.assign(providerConnectUrl("google"));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button type="button" variant="outline" className="w-full" onClick={continueWithGoogle}>
        <GoogleMark />
        Continue with Google
      </Button>
    </div>
  );
}
