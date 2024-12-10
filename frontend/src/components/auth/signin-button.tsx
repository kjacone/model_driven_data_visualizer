
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SignInButton() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/getstarted" });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <Button onClick={handleSignOut} variant="outline">
        Sign Out
      </Button>
    );
  }

  return <Button onClick={handleSignIn}>Sign in with Google</Button>;
}