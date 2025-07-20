"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import LoadingPage from "../custom/layout/loading-page";

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // If not authenticated and not on login page, redirect to login
          if (pathname !== "/login") {
            router.replace("/login");
          }
          return;
        }

        // Get user role
        const { data: roleData, error } = await supabase
          .from("user_profile")
          .select("role")
          .eq("id", user.id)
          .single();

        const userRole = roleData?.role;
        console.log("User Role:", userRole);

        // Handle missing role
        if (!userRole || error) {
          if (pathname !== "/access-denied") {
            router.replace("/access-denied");
          }
          return;
        }

        // Role-based redirects
        if (pathname === "/login") {
          if (userRole === "agriculturist") {
            router.replace("/dashboard/programs");
          } else if (userRole === "field_technician") {
            router.replace("/field-technician");
          } else {
            router.replace("/access-denied");
          }
          return;
        }

        if (pathname === "/") {
          if (userRole === "agriculturist") {
            router.replace("/dashboard/programs");
          } else if (userRole === "field_technician") {
            router.replace("/field-technician");
          } else {
            router.replace("/access-denied");
          }
          return;
        }

        if (pathname === "/dashboard") {
          router.replace("/dashboard/programs");
          return;
        }

        // Protect dashboard routes
        if (pathname.startsWith("/dashboard") && userRole !== "agriculturist") {
          router.replace("/access-denied");
          return;
        }

        // Protect field technician routes
        if (
          pathname.startsWith("/field-technician") &&
          userRole !== "field_technician"
        ) {
          router.replace("/access-denied");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndRedirect();
  }, [pathname, router, supabase]);

  if (isLoading) return <LoadingPage />;
  return <>{children}</>;
}
