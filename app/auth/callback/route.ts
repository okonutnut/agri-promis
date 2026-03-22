import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ratelimit } from "@/lib/rate-limiter";

async function deactivatePastTravelOrders() {
  const res = await fetch(
    "https://aawvhtjwzyxsfyikmeis.supabase.co/functions/v1/deactivate_past_travel_orders",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    console.error("Failed to deactivate past travel orders");
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    next = "/";
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.redirect(`${origin}/?error=rate_limited`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await deactivatePastTravelOrders();
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}`);
}
