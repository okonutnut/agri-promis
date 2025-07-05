"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function GoogleSignInButton() {
  const supabase = createClient();

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button
      type="submit"
      className="flex items-center gap-2 cursor-pointer my-3 w-full"
      variant={"outline"}
      onClick={login}
    >
      <Image src="/google-icon.png" alt="Google" width={20} height={20} />
      Login with Google
    </Button>
  );
}
