"use server";

import { headers } from "next/headers";

export async function getClientIpFromHeaders() {
  const xff = (await headers()).get("x-forwarded-for");
  return xff?.split(",")[0] || "unknown";
}
