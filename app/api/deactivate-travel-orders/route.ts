import { NextResponse } from "next/server";

export async function GET() {
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
    return NextResponse.json(
      { error: "Failed to call Supabase function" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
