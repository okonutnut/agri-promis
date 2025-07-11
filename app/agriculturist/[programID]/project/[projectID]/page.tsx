"use client";

import Navbar from "@/components/custom/navbar";
import { useParams } from "next/navigation";

export default function ProjectPage() {
  const { programID, projectID } = useParams();
  return (
    <>
      <Navbar pageTitle="Overview" />
      <div className="w-full"></div>
    </>
  );
}
