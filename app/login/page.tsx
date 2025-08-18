import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import LoginCard from "./components/login-card";

export default async function LoginPage() {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
  }

  // Redirect if session exists
  if (session) {
    redirect("/");
  }

  return (
    <div className="grid grid-cols-3 h-screen w-screen gap-2 overflow-hidden">
      <section className="hidden md:block col-span-2 bg-[url('/login-bg.jpg')] bg-cover bg-center relative">
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex flex-col items-center justify-center gap-2">
          <h1 className="text-white text-4xl font-bold text-center max-w-[80%] mb-4">
            Agricultural Project Monitoring and Implementation System
            (Agri-ProMIS)
          </h1>
          <p className="text-white text-md text-center italic">
            &quot;Enhancing Agricultural Project Management&quot;
          </p>
        </div>
      </section>
      <LoginCard />
    </div>
  );
}
