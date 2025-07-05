"use client";

import { useSupabase } from "@/app/supabase-provider";

export function GoogleSignInButton() {
  const supabase = useSupabase();

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return <button onClick={login}>Sign in with Google</button>;
}
