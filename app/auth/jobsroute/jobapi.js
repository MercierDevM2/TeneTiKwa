import { NextResponse } from "next/server";

export async function POST(req) {

  try {

    const body = await req.json();

    const {
      emails,
      titre,
      entreprise,
      lieu,
    } = body;

    // 🔥 sécurité
    if (!emails || emails.length === 0) {
      return NextResponse.json(
        { error: "Aucun email fourni" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",

        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },

        body: JSON.stringify({

          sender: {
            name: "TeneTiKwa",
            email: "greenitcar@gmail.com",
          },

          to: emails,

          subject: `Nouvelle offre : ${titre}`,

          htmlContent: `
            <h2>Nouvelle offre disponible</h2>

            <p><strong>Poste :</strong> ${titre}</p>

            <p><strong>Entreprise :</strong> ${entreprise}</p>

            <p><strong>Lieu :</strong> ${lieu}</p>

            <br/>

            <a href="https://tenetikwa.vercel.app/">
              Voir l'offre
            </a>
          `,
        }),
      }
    );

    const data = await response.json();

    // 🔥 erreur Brevo
    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message || "Erreur Brevo",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}