"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function GoogleSignInButton() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error during Google sign-in:", error);
      toast.error("Unable to sign in. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="flex items-center gap-2 cursor-pointer my-3 min-w-62.5 mx-auto shadow-none rounded-pill"
      type="button"
      disabled={isLoading}
      variant={isLoading ? "ghost" : "outline"}
      onClick={login}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          <Image src="/google-icon.png" alt="Google" width={20} height={20} />
          Login with Google
        </>
      )}
    </Button>
  );
}
