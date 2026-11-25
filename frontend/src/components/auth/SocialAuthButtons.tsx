import { providerConnectUrl, RETURN_TO_KEY } from "@/api/auth";
import { Button } from "@/components/ui/button";

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        fill="#EA4335"
        d="M12 5.4c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 2.1 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.6 2.8C6.1 7.4 8.8 5.4 12 5.4z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.4H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.6z"
      />
      <path
        fill="#FBBC05"
        d="M5.2 14.6c-.2-.8-.4-1.7-.4-2.6s.1-1.8.4-2.6L1.6 6.6C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.4l3.6-2.8z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.9-2.2-6.8-5.1l-3.6 2.8C3.5 20.4 7.4 23 12 23z"
      />
    </svg>
  );
}

export function SocialAuthButtons() {
  function continueWithGoogle() {
    try {
      sessionStorage.setItem(
        RETURN_TO_KEY,
        window.location.pathname + window.location.search,
      );
    } catch {
      // Session storage unavailable; the callback falls back to the home page.
    }
    window.location.assign(providerConnectUrl("google"));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#596556]">
        <span className="h-px flex-1 bg-[#D5E3D9]" />
        or
        <span className="h-px flex-1 bg-[#D5E3D9]" />
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-10 w-full cursor-pointer rounded-full border-[1.5px] border-[#B2C9A8] bg-white font-semibold text-[#202B20] transition-colors hover:border-[#3F673C] hover:bg-[#F2F6EF] hover:text-[#202B20]"
        onClick={continueWithGoogle}
      >
        <GoogleMark />
        Continue with Google
      </Button>
    </div>
  );
}
