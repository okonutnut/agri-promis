import LoadingPage from "@/components/custom/layout/loading-page";
import type { Metadata } from "next";
import { Suspense } from "react";

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
    <Suspense fallback={<LoadingPage />}>
      <main>{children}</main>
    </Suspense>
  );
}
