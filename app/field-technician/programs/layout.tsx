import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS | Assigned Projects",
  description: "Dashboard page for Agri-ProMIS",
};

export default function AssignedProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
