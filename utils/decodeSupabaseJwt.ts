import { jwtDecode } from "jwt-decode";

export interface SupabaseJWT {
  aud: string;
  exp: number;
  sub: string;
  email?: string;
  phone?: string;
  session_id?: string;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
  role?: string;
  [key: string]: any;
}

export function decodeSupabaseJWT(token: string): SupabaseJWT | null {
  try {
    const decoded = jwtDecode<SupabaseJWT>(token);
    return decoded;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
}
