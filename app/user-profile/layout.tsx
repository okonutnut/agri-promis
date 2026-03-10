import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS | User Profile",
  description: "User profile page for Agri-ProMIS",
};

export default function UserProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
