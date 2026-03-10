import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS | Post Travel Reports",
  description: "Post Travel Reports page for Agri-ProMIS",
};

export default function PostTravelReportsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
