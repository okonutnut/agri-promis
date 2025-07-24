import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS - Access Denied",
  description: "Dashboard page for Agri-ProMIS",
};

export default function AccessDeniedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full h-screen flex flex-col justify-center items-center gap-5">
      {children}
    </main>
  );
}
