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

  // 1. On crée une réponse temporaire (on changera l'URL après)
  const response = NextResponse.redirect(new URL("/dashboard", url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 2. L'échange du code remplit les cookies de session dans 'response'
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.session) {
    return NextResponse.redirect(new URL("/auth/error", url));
  }

  // 3. Logique de profil...
  const user = data.user;
  let { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({ id: user.id, email: user.email, role: "user" })
      .select().single();
    profile = newProfile;
  }

    // 4. 🔥 LA MODIFICATION : Ajouter un paramètre de succès
  const isTargetAdmin = profile?.role === "admin";
  const redirectPath = isTargetAdmin ? "/dashboard/admin" : "/dashboard";
  
  // On crée l'URL finale et on ajoute "?verified=true"
  const finalUrl = new URL(redirectPath, url.origin);
  finalUrl.searchParams.set("verified", "true"); 

  // On met à jour l'en-tête de redirection
  response.headers.set("Location", finalUrl.toString());

  return response;
}
