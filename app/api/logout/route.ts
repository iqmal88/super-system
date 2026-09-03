import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Destroy the secure cookie
  cookieStore.delete("auth_session");
  
  return NextResponse.json({ success: true });
}