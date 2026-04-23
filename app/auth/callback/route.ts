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

  const response = NextResponse.redirect(new URL("/dashboard", url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set(name, value, options);
        },
        remove: (name, options) => {
          response.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.user) {
    return NextResponse.redirect(new URL("/auth/error", url));
  }

  const user = data.user;

  let { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        role: "user",
        nom: user.email?.split("@")[0],
      })
      .select()
      .single();

    profile = newProfile;
  }

  // 🔥 redirect final AVEC cookies
  const redirectPath =
    profile?.role === "admin" ? "/dashboard/admin" : "/dashboard";

  const finalResponse = NextResponse.redirect(new URL(redirectPath, url));

  response.cookies.getAll().forEach((cookie) => {
    finalResponse.cookies.set(cookie.name, cookie.value);
  });

  return finalResponse;
}