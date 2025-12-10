// export const runtime = 'nodejs';

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export async function updateSession(request: NextRequest) {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
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
  });

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
  if (pathname === "/login" || pathname === "/") {
    if (userRole === 1) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    } else if (userRole === 2) {
      url.pathname = "/field-technician/dashboard";
      return NextResponse.redirect(url);
    } else {
      url.pathname = "/access-denied";
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/field-technician") {
    url.pathname = "/field-technician/dashboard";
    return NextResponse.redirect(url);
  }

  // // Protect dashboard routes - only admins allowed
  if (pathname.startsWith("/dashboard") && userRole !== 1) {
    url.pathname = "/access-denied";
    return NextResponse.redirect(url);
  }

  // // Protect field technician routes - only field technicians allowed
  if (pathname.startsWith("/field-technician") && userRole !== 2) {
    url.pathname = "/access-denied";
    return NextResponse.redirect(url);
  }

  // Allow access if all checks pass
  return supabaseResponse;
}
