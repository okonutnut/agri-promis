"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

export function GoogleSignInButton() {
  const [state, setState] = useState<"ready" | "loading" | "disabled">("ready");
  const supabase = createClient();

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  useEffect(() => {
    async function checkUser() {
      setState("loading");
      const user = (await supabase.auth.getUser()).data.user;
      if (user !== null) {
        setState("disabled");
      } else {
        setState("ready");
      }
    }
    checkUser();
  }, [supabase.auth]);

  return (
    <Button
      type="submit"
      className="flex items-center gap-2 cursor-pointer my-3 min-w-[250px] mx-auto"
      disabled={state !== "ready"}
      variant={"outline"}
      onClick={login}
    >
      <Image src="/google-icon.png" alt="Google" width={20} height={20} />
      Login with Google
    </Button>
  );
}
