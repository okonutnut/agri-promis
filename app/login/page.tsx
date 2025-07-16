"use client";

import { GoogleSignInButton } from "./components/google-login";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import LoginCard from "./components/login-card";

export default function LoginPage() {
  const search = useSearchParams();

  useEffect(() => {
    const errorCode =
      search.get("error_code") ||
      new URLSearchParams(window.location.hash.substring(1)).get("error_code");

    if (errorCode === "signup_disabled") {
      toast.error("Failed to login");
    }
  }, [search]);

  console.log("");
  return (
    <>
      <div className="grid grid-cols-3 h-screen w-screen gap-2 overflow-hidden">
        <section className="hidden md:block col-span-2 bg-[url('/farmers-1.png')] bg-cover bg-center relative">
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
        <section className="col-span-full md:col-span-1 h-screen flex items-center justify-center bg-white">
          <LoginCard>
            <GoogleSignInButton />
          </LoginCard>
        </section>
      </div>
    </>
  );
}
