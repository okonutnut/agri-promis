import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-primary text-lg font-bold">Please wait...</p>
    </div>
  );
}
