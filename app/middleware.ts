// middleware.ts
// @ts-nocheck
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next();

  const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          // force SameSite=Lax et Secure si HTTPS en production
          response.cookies.set(name, value, {
            ...options,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
          });
        });
      },
    },
  }
);

  const pathname = request.nextUrl.pathname;

if (pathname.startsWith("/auth/callback")) {
  return response;
}

const {
  data: { user },
} = await supabase.auth.getUser();

  // 🔐 Protection dashboard
  if (!user && pathname.startsWith("/dashboard")) {
  return NextResponse.redirect(new URL("/auth/login", request.url));
}

  // 🔐 Protection admin
  if (user && pathname.startsWith("/dashboard/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};