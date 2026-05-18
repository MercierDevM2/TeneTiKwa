import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
console.log("SUPABASE KEY:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
export async function POST() {
  try {
    // 1️⃣ Users
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, email, nom");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const validUsers = (users || []).filter(u => u.email);

    // 2️⃣ Fonction email
    const sendEmail = async (user) => {
      return fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: "TeneTiKwa",
            email: "greenitcar@gmail.com",
          },
          to: [
            {
              email: user.email,
              name: user.nom || "Utilisateur",
            },
          ],
          subject: "Nouvelles offres disponibles",
          htmlContent: `
            <h2>Bonjour ${user.nom || "Utilisateur"} </h2>
            <p>De nouvelles offres viennent d’être publiées.</p>
            <a href="https://tenetikwa.vercel.app/">Ouvrir l'app</a>
          `,
        }),
      });
    };

    // 3️⃣ ENVOI RÉEL (IMPORTANT)
    const results = await Promise.all(
      validUsers.map(async (user) => {
        try {
          const res = await sendEmail(user);
          const text = await res.text();

          return {
            email: user.email,
            status: res.ok ? "sent" : "failed",
            raw: text,
          };
        } catch (err) {
          return {
            email: user.email,
            status: "error",
            error: err.message,
          };
        }
      })
    );
    console.log("BREVO KEY:", process.env.BREVO_API_KEY);

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}