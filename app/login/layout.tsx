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
  return <main>{children}</main>;
}
