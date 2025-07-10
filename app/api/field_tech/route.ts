import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { UserProfile } from "@/app/agriculturist/[programID]/field-technicians/types";
import { format } from "date-fns";

export async function GET() {
  try {
    const supabase = await createClient();
    const data = await supabase
      .from("user_profile")
      .select("*")
      .eq("role", "field_technician")
      .order("created_at", { ascending: false });

    const result = data.data?.map((item) => ({
      ...item,
      role: item.role
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char: string) => char.toUpperCase()),
      created_at: format(new Date(item.created_at), "MMM dd, yyyy hh:mm a"),
    }));

    return NextResponse.json(result as UserProfile[], {
      status: data.error ? 500 : 200,
      statusText: data.error ? data.error.message : "OK",
    });
  } catch (error) {
    console.error("Error fetching field technicians:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
