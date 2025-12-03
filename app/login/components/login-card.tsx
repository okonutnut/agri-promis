"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import GoogleSignInButton from "./google-login";

export default function LoginCard() {
  return (
    <section className="col-span-full md:col-span-1 h-screen flex items-center justify-center">
      <Card className="p-8 w-full gap-2 mx-4 border-none shadow-none">
        <CardHeader>
          <Image
            src="/favicon.svg"
            alt="app-logo"
            width={200}
            height={200}
            className="mx-auto"
            priority
            fetchPriority="high"
          />
        </CardHeader>
        <CardContent>
          <h1 className="md:hidden text-3xl font-bold text-center mb-4 text-primary uppercase">
            Agri-ProMIS <br />
            <p className="text-primary text-sm text-center italic">
              &quot;Enhancing Agricultural Project Management&quot;
            </p>
          </h1>
          <h1 className="text-sm font-medium text-center mb-2">
            Sign in to your account
          </h1>
          <Suspense
            fallback={
              <center>
                <Loader2 className="animate-spin" />
              </center>
            }
          >
            <GoogleSignInButton />
          </Suspense>
        </CardContent>
        <p className="text-center text-xs text-gray-500">version 0.1.5</p>
      </Card>
    </section>
  );
}
