import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // If user is not authenticated
  if (!user) {
    // Allow access to login page
    if (pathname === "/login") {
      return supabaseResponse;
    }
    // Redirect to login for all other pages
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // User is authenticated
  // Redirect from login page to root
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // User is authenticated - get user role from database or metadata
  let userRole = user.user_metadata?.role;

  // Handle missing role - redirect to access denied
  if (!userRole) {
    if (pathname !== "/access-denied") {
      const url = request.nextUrl.clone();
      url.pathname = "/access-denied";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Role-based redirects for authenticated users
  const url = request.nextUrl.clone();

  // Redirect from login page based on role
  if (pathname === "/login") {
    if (userRole === "agriculturist") {
      url.pathname = "/dashboard/programs";
      return NextResponse.redirect(url);
    } else if (userRole === "field_technician") {
      url.pathname = "/field-technician";
      return NextResponse.redirect(url);
    } else {
      url.pathname = "/access-denied";
      return NextResponse.redirect(url);
    }
  }

  // Redirect from root path based on role
  if (pathname === "/") {
    if (userRole === "agriculturist") {
      url.pathname = "/dashboard/programs";
      return NextResponse.redirect(url);
    } else if (userRole === "field_technician") {
      url.pathname = "/field-technician";
      return NextResponse.redirect(url);
    } else {
      url.pathname = "/access-denied";
      return NextResponse.redirect(url);
    }
  }

  // Redirect from /dashboard to /dashboard/programs
  if (pathname === "/dashboard") {
    url.pathname = "/dashboard/programs";
    return NextResponse.redirect(url);
  }

  // Protect dashboard routes - only agriculturists allowed
  if (pathname.startsWith("/dashboard") && userRole !== "agriculturist") {
    url.pathname = "/access-denied";
    return NextResponse.redirect(url);
  }

  // Protect field technician routes - only field technicians allowed
  if (
    pathname.startsWith("/field-technician") &&
    userRole !== "field_technician"
  ) {
    url.pathname = "/access-denied";
    return NextResponse.redirect(url);
  }

  // Allow access if all checks pass
  return supabaseResponse;
}
