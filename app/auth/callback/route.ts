// @ts-nocheck
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/auth/error", url));
  }

  // Accumule les cookies temporairement
  let cookiesToSet = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookiesToSet = cookies; // on garde la référence
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.session) {
    return NextResponse.redirect(new URL("/auth/error", url));
  }

  const user = data.session.user;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const redirectTo =
    profile?.role === "admin"
      ? "/dashboard/admin"
      : "/dashboard";

  // Crée la réponse finale
  const response = NextResponse.redirect(new URL(redirectTo, url.origin));

  // Pose tous les cookies de session AVEC les bonnes options
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, {
      ...options,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  });

  return response;
}