import type { Metadata } from "next";
import "../globals.css";

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
    <main>{children}</main>
  );
}
