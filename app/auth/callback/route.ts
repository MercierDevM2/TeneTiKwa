// app/auth/callback/route.ts
// @ts-nocheck
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/auth/error", url));
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          // on injecte plus tard dans response finale
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.session) {
    return NextResponse.redirect(new URL("/auth/error", url));
  }

  const user = data.user;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin";

  const finalUrl = new URL(
    isAdmin ? "/dashboard/admin" : "/dashboard",
    url.origin
  );

  finalUrl.searchParams.set("verified", "true");

  const response = NextResponse.redirect(finalUrl);

  // 🔥 IMPORTANT : réinjecter cookies ici
  const cookies = request.cookies.getAll();
  cookies.forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });

  return response;
}