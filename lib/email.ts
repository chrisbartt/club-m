import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendWelcomeEmail(to: string, prenom: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL SKIP] Welcome email to ${to} (no API key)`);
    return;
  }

  await getResend().emails.send({
    from: "Club M <noreply@clubm.cd>",
    to,
    subject: `Bienvenue au Club M, ${prenom} !`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h1 style="color: #a55b46;">Bienvenue au Club M, ${prenom} !</h1>
        <p>Ton inscription a bien ete enregistree.</p>
        <p>Pour activer ton compte, soumets tes documents de verification d'identite depuis ton espace.</p>
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXTAUTH_URL}/inscription"
             style="background: #a55b46; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Continuer mon inscription
          </a>
        </p>
        <p style="color: #888; font-size: 12px; margin-top: 32px;">
          Club M — La communaute des femmes entrepreneures
        </p>
      </div>
    `,
  });
}

export async function sendVerificationApprovedEmail(
  to: string,
  prenom: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL SKIP] Approved email to ${to} (no API key)`);
    return;
  }

  await getResend().emails.send({
    from: "Club M <noreply@clubm.cd>",
    to,
    subject: `${prenom}, ton compte Club M est active !`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h1 style="color: #a55b46;">Felicitations, ${prenom} !</h1>
        <p>Ton identite a ete verifiee avec succes. Ton compte Club M est maintenant actif.</p>
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXTAUTH_URL}/login"
             style="background: #a55b46; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Acceder a mon espace
          </a>
        </p>
      </div>
    `,
  });
}

export async function sendVerificationPendingEmail(
  to: string,
  prenom: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL SKIP] Pending review email to ${to} (no API key)`);
    return;
  }

  await getResend().emails.send({
    from: "Club M <noreply@clubm.cd>",
    to,
    subject: `${prenom}, verification en cours`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h1 style="color: #a55b46;">Verification en cours</h1>
        <p>Bonjour ${prenom},</p>
        <p>Tes documents sont en cours de verification manuelle par notre equipe.
           Tu recevras une reponse sous 24 a 48 heures.</p>
        <p style="color: #888; font-size: 12px; margin-top: 32px;">
          Club M — La communaute des femmes entrepreneures
        </p>
      </div>
    `,
  });
}
