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

  const { data: userProfile } = await supabase
    .from("user_profile")
    .select("role")
    .eq("id", user?.id)
    .single();

  // Ensure consistent role checking and handle null cases
  const userRole = userProfile?.role;

  // If user is authenticated and on root, redirect based on role
  if (user && request.nextUrl.pathname === "/") {
    if (userRole === "agriculturist") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/programs";
      return NextResponse.redirect(url);
    } else if (userRole === "field_technician") {
      const url = request.nextUrl.clone();
      url.pathname = "/field-technician";
      return NextResponse.redirect(url);
    } else {
      // Handle users with no role or unknown role
      const url = request.nextUrl.clone();
      url.pathname = "/access-denied";
      return NextResponse.redirect(url);
    }
  }

  // Protect dashboard routes - only agriculturists allowed
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (userRole !== "agriculturist") {
      const url = request.nextUrl.clone();
      url.pathname = "/access-denied";
      return NextResponse.redirect(url);
    }
  }

  // Protect field technician routes - only field technicians allowed
  if (request.nextUrl.pathname.startsWith("/field-technician")) {
    if (userRole !== "field_technician") {
      const url = request.nextUrl.clone();
      url.pathname = "/access-denied";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
