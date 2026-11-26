import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
} from "@/components/editorial/EditorialPagePrimitives";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

/** Landing route for Strapi's email-confirmation redirect (/auth/confirmed). */
export default function EmailConfirmed() {
  const { openAuthModal, isAuthenticated } = useAuth();
  const reduced = useReducedMotion();

  return (
    <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center bg-[#F2F6EF] px-4 py-16 sm:py-24">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EDITORIAL_EASE }}
        className="w-full max-w-md overflow-hidden rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white shadow-md"
      >
        <div
          aria-hidden="true"
          className="h-1.5 w-full bg-gradient-to-r from-[#3F673C] via-[#187347] to-[#94B985]"
        />
        <div className="px-6 py-9 text-center sm:px-8">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#187347]">
            GDD Toolkit · Email Verification
          </p>
          <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#94B985] bg-[#EDF4E8] text-[#187347]">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1
            className="mt-4 text-2xl font-semibold text-[#202B20]"
            style={EDITORIAL_SERIF_STYLE}
          >
            Email confirmed
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-[#596556]">
            Your account is active.{" "}
            {isAuthenticated
              ? "You're signed in."
              : "You can sign in now."}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {!isAuthenticated && (
              <Button
                className="h-10 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-6 font-semibold text-white hover:brightness-110"
                onClick={() => openAuthModal("sign-in")}
              >
                Sign in
              </Button>
            )}
            <Button
              variant="outline"
              nativeButton={false}
              className="h-10 rounded-full border-[1.5px] border-[#94B985] bg-white px-6 font-semibold text-[#284B26] hover:border-[#3F673C] hover:bg-[#EDF4E8] hover:text-[#202B20]"
              render={<Link to="/" />}
            >
              Back to home
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
