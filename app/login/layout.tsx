import type { Metadata } from "next";
import { Suspense } from "react";
import LoadingPage from "@/components/custom/layout/loading-page";

export const metadata: Metadata = {
  title: "Agri-ProMIS - Login",
  description: "Login page for Agri-ProMIS",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Suspense fallback={<LoadingPage />}>{children}</Suspense>
    </main>
  );
}
