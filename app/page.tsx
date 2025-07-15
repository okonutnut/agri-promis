import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export default function RootPage() {
  // This page should not be reached due to middleware redirects
  // But just in case, show a loading state
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Loading...</h1>
        <p className="text-gray-600">
          Redirecting you to the appropriate page...
        </p>
      </div>
    </div>
  );
}
