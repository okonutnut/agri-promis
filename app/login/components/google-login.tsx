"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";

export default function GoogleSignInButton() {
  const supabase = createClient();
  const [state, setState] = useState<"ready" | "loading" | "disabled">("ready");

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
        await InsertActivityLogAction(
          "Login",
          `Signed into the system.`,
          undefined
        );
        setState("disabled");
      } else {
        setState("ready");
      }
    }
    checkUser();
  }, [supabase.auth]);

  return (
    <Button
      className="flex items-center gap-2 cursor-pointer my-3 min-w-[250px] mx-auto shadow-none rounded-pill"
      type="submit"
      disabled={state !== "ready"}
      variant={state === "loading" ? "ghost" : "outline"}
      onClick={login}
    >
      {state === "loading" ? (
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
