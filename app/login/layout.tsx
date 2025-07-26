import LoadingPage from "@/components/custom/layout/loading-page";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS Login",
  description: "Login page for Agri-ProMIS",
  manifest: "/manifest",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<LoadingPage />}>
      <main>{children}</main>
    </Suspense>
  );
}
