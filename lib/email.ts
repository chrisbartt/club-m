import { Resend } from "resend";

const BRAND_COLOR = "#a55b46";
// Use Resend's default sandbox address until clubm.cd domain is verified
const FROM = process.env.EMAIL_FROM || "Club M <onboarding@resend.dev>";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function emailLayout(content: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: ${BRAND_COLOR}; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">Club M</h1>
      </div>
      <div style="padding: 32px 24px;">
        ${content}
      </div>
      <div style="border-top: 1px solid #eee; padding: 20px 24px; text-align: center;">
        <p style="color: #999; font-size: 12px; margin: 0;">Club M — Kinshasa, RDC</p>
      </div>
    </div>
  `;
}

function button(label: string, url: string): string {
  return `
    <p style="margin-top: 24px; text-align: center;">
      <a href="${url}"
         style="background: ${BRAND_COLOR}; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600;">
        ${label}
      </a>
    </p>
  `;
}

// ---------------------------------------------------------------------------
// Core send helper with retry + graceful failure
// ---------------------------------------------------------------------------

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(params: SendEmailParams): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL SKIP] "${params.subject}" to ${params.to} (no RESEND_API_KEY)`);
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[EMAIL DEV] Sending "${params.subject}" to ${params.to}`);
  }

  const payload = { from: FROM, ...params };

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await getResend().emails.send(payload);
      return;
    } catch (error) {
      console.error(`[EMAIL ERROR] Attempt ${attempt}/2 failed for "${params.subject}" to ${params.to}:`, error);
      if (attempt === 2) {
        console.error(`[EMAIL FAIL] Giving up on "${params.subject}" to ${params.to}`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 1. Welcome
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(
  to: string,
  prenom: string,
  verificationUrl?: string
) {
  const verificationBlock = verificationUrl
    ? `<p>Pour activer ton compte, clique sur le bouton ci-dessous :</p>${button("Verifier mon email", verificationUrl)}`
    : `<p>Pour activer ton compte, soumets tes documents de verification d'identite depuis ton espace.</p>${button("Continuer mon inscription", `${getBaseUrl()}/inscription`)}`;

  await sendEmail({
    to,
    subject: `Bienvenue au Club M, ${prenom} !`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Bienvenue au Club M, ${prenom} !</h2>
      <p>Ton inscription a bien ete enregistree.</p>
      ${verificationBlock}
    `),
  });
}

// ---------------------------------------------------------------------------
// 2. Verification approved
// ---------------------------------------------------------------------------

export async function sendVerificationApprovedEmail(
  to: string,
  prenom: string
) {
  await sendEmail({
    to,
    subject: `${prenom}, ton compte Club M est active !`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Felicitations, ${prenom} !</h2>
      <p>Ton identite a ete verifiee avec succes. Ton compte Club M est maintenant actif.</p>
      ${button("Acceder a mon espace", `${getBaseUrl()}/login`)}
    `),
  });
}

// ---------------------------------------------------------------------------
// 3. Verification pending
// ---------------------------------------------------------------------------

export async function sendVerificationPendingEmail(
  to: string,
  prenom: string
) {
  await sendEmail({
    to,
    subject: `${prenom}, verification en cours`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Verification en cours</h2>
      <p>Bonjour ${prenom},</p>
      <p>Tes documents sont en cours de verification manuelle par notre equipe.
         Tu recevras une reponse sous 24 a 48 heures.</p>
    `),
  });
}

// ---------------------------------------------------------------------------
// 4. Password reset
// ---------------------------------------------------------------------------

export async function sendPasswordResetEmail(
  to: string,
  prenom: string,
  resetUrl: string
) {
  await sendEmail({
    to,
    subject: `Club M — Reinitialiser ton mot de passe`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Reinitialisation du mot de passe</h2>
      <p>Bonjour ${prenom},</p>
      <p>Tu as demande la reinitialisation de ton mot de passe. Clique sur le bouton ci-dessous pour en choisir un nouveau :</p>
      ${button("Reinitialiser mon mot de passe", resetUrl)}
      <p style="color: #888; font-size: 13px; margin-top: 24px;">
        Si tu n'as pas fait cette demande, ignore cet email. Ce lien expire dans 1 heure.
      </p>
    `),
  });
}

// ---------------------------------------------------------------------------
// 5. Email verified confirmation
// ---------------------------------------------------------------------------

export async function sendEmailVerifiedConfirmation(
  to: string,
  prenom: string
) {
  await sendEmail({
    to,
    subject: `Club M — Email verifie`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Email verifie !</h2>
      <p>Bonjour ${prenom},</p>
      <p>Ton adresse email a ete verifiee avec succes. Tu peux maintenant profiter pleinement de ton espace Club M.</p>
      ${button("Acceder a mon espace", `${getBaseUrl()}/dashboard`)}
    `),
  });
}

// ---------------------------------------------------------------------------
// 6. Order confirmation (buyer)
// ---------------------------------------------------------------------------

interface OrderConfirmationBuyerData {
  number: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  total: number;
  currency: string;
  confirmationCode: string;
  businessName: string;
}

export async function sendOrderConfirmationBuyer(
  to: string,
  prenom: string,
  order: OrderConfirmationBuyerData
) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.unitPrice.toLocaleString()} ${order.currency}</td>
      </tr>`
    )
    .join("");

  await sendEmail({
    to,
    subject: `Club M — Commande ${order.number} confirmee`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Commande confirmee !</h2>
      <p>Bonjour ${prenom},</p>
      <p>Ta commande <strong>${order.number}</strong> chez <strong>${order.businessName}</strong> a bien ete enregistree.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #f8f8f8;">
            <th style="padding: 8px; text-align: left;">Produit</th>
            <th style="padding: 8px; text-align: center;">Qte</th>
            <th style="padding: 8px; text-align: right;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px 8px; font-weight: 700;">Total</td>
            <td style="padding: 12px 8px; text-align: right; font-weight: 700; color: ${BRAND_COLOR};">
              ${order.total.toLocaleString()} ${order.currency}
            </td>
          </tr>
        </tfoot>
      </table>

      <div style="background: #fdf6f4; border: 1px solid ${BRAND_COLOR}; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
        <p style="margin: 0 0 4px 0; font-size: 13px; color: #888;">Code de confirmation a la livraison</p>
        <p style="margin: 0; font-size: 28px; font-weight: 700; color: ${BRAND_COLOR}; letter-spacing: 4px;">${order.confirmationCode}</p>
      </div>

      <p style="color: #888; font-size: 13px;">
        Communique ce code au livreur uniquement au moment de la reception de ta commande.
      </p>

      ${button("Voir ma commande", `${getBaseUrl()}/achats`)}
    `),
  });
}

// ---------------------------------------------------------------------------
// 7. Order notification (seller)
// ---------------------------------------------------------------------------

interface OrderNotificationSellerData {
  number: string;
  buyerName: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  total: number;
  currency: string;
}

export async function sendOrderNotificationSeller(
  to: string,
  businessName: string,
  order: OrderNotificationSellerData
) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.unitPrice.toLocaleString()} ${order.currency}</td>
      </tr>`
    )
    .join("");

  await sendEmail({
    to,
    subject: `Club M — Nouvelle commande ${order.number}`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Nouvelle commande !</h2>
      <p>Bonjour ${businessName},</p>
      <p>Tu as recu une nouvelle commande <strong>${order.number}</strong> de <strong>${order.buyerName}</strong>.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #f8f8f8;">
            <th style="padding: 8px; text-align: left;">Produit</th>
            <th style="padding: 8px; text-align: center;">Qte</th>
            <th style="padding: 8px; text-align: right;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px 8px; font-weight: 700;">Total</td>
            <td style="padding: 12px 8px; text-align: right; font-weight: 700; color: ${BRAND_COLOR};">
              ${order.total.toLocaleString()} ${order.currency}
            </td>
          </tr>
        </tfoot>
      </table>

      ${button("Gerer mes commandes", `${getBaseUrl()}/mon-business/commandes`)}
    `),
  });
}

// ---------------------------------------------------------------------------
// 8. Order shipped
// ---------------------------------------------------------------------------

interface OrderShippedData {
  number: string;
  businessName: string;
  confirmationCode: string;
}

export async function sendOrderShippedEmail(
  to: string,
  prenom: string,
  order: OrderShippedData
) {
  await sendEmail({
    to,
    subject: `Club M — Commande ${order.number} expediee`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Commande expediee !</h2>
      <p>Bonjour ${prenom},</p>
      <p>Ta commande <strong>${order.number}</strong> de <strong>${order.businessName}</strong> a ete expediee.</p>

      <div style="background: #fdf6f4; border: 1px solid ${BRAND_COLOR}; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
        <p style="margin: 0 0 4px 0; font-size: 13px; color: #888;">Code de confirmation a la livraison</p>
        <p style="margin: 0; font-size: 28px; font-weight: 700; color: ${BRAND_COLOR}; letter-spacing: 4px;">${order.confirmationCode}</p>
      </div>

      <p style="color: #888; font-size: 13px;">
        Communique ce code au livreur uniquement au moment de la reception.
      </p>

      ${button("Suivre ma commande", `${getBaseUrl()}/achats`)}
    `),
  });
}

// ---------------------------------------------------------------------------
// 9. Delivery confirmed (buyer)
// ---------------------------------------------------------------------------

interface DeliveryConfirmedBuyerData {
  number: string;
  businessName: string;
}

export async function sendDeliveryConfirmedBuyer(
  to: string,
  prenom: string,
  order: DeliveryConfirmedBuyerData
) {
  await sendEmail({
    to,
    subject: `Club M — Livraison confirmee (${order.number})`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Livraison confirmee !</h2>
      <p>Bonjour ${prenom},</p>
      <p>La livraison de ta commande <strong>${order.number}</strong> de <strong>${order.businessName}</strong> a ete confirmee.</p>
      <p>Merci pour ton achat ! N'hesite pas a revenir sur la marketplace Club M.</p>
      ${button("Decouvrir la marketplace", `${getBaseUrl()}/marketplace`)}
    `),
  });
}

// ---------------------------------------------------------------------------
// 10. Delivery confirmed (seller)
// ---------------------------------------------------------------------------

interface DeliveryConfirmedSellerData {
  number: string;
  buyerName: string;
}

export async function sendDeliveryConfirmedSeller(
  to: string,
  businessName: string,
  order: DeliveryConfirmedSellerData
) {
  await sendEmail({
    to,
    subject: `Club M — Livraison confirmee (${order.number})`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Livraison confirmee !</h2>
      <p>Bonjour ${businessName},</p>
      <p>La livraison de la commande <strong>${order.number}</strong> a <strong>${order.buyerName}</strong> a ete confirmee.</p>
      <p>Le paiement sera traite selon les conditions habituelles.</p>
      ${button("Voir mes commandes", `${getBaseUrl()}/mon-business/commandes`)}
    `),
  });
}

// ---------------------------------------------------------------------------
// 11. KYC submitted — admin notification
// ---------------------------------------------------------------------------

export async function sendKycSubmittedAdminEmail(
  to: string,
  memberName: string
) {
  await sendEmail({
    to,
    subject: `Nouvelle demande KYC : ${memberName}`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Nouvelle demande KYC</h2>
      <p>Une nouvelle demande de verification d'identite a ete soumise par <strong>${memberName}</strong>.</p>
      <p>Veuillez examiner les documents et approuver ou rejeter la demande depuis l'espace d'administration.</p>
      ${button("Voir les demandes KYC", `${getBaseUrl()}/admin/kyc`)}
    `),
  });
}

// ---------------------------------------------------------------------------
// 12. KYC approved — member notification
// ---------------------------------------------------------------------------

export async function sendKycApprovedEmail(
  to: string,
  prenom: string
) {
  await sendEmail({
    to,
    subject: `Club M — Identite verifiee`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Identite verifiee !</h2>
      <p>Bonjour ${prenom},</p>
      <p>Ton identite a ete verifiee avec succes. Tu peux maintenant acceder a toutes les fonctionnalites de ton espace membre.</p>
      ${button("Acceder a mon espace", `${getBaseUrl()}/dashboard`)}
    `),
  });
}

// ---------------------------------------------------------------------------
// 13. KYC rejected — member notification
// ---------------------------------------------------------------------------

export async function sendKycRejectedEmail(
  to: string,
  prenom: string,
  reason: string
) {
  await sendEmail({
    to,
    subject: `Club M — Verification non approuvee`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Verification non approuvee</h2>
      <p>Bonjour ${prenom},</p>
      <p>Ta demande de verification d'identite n'a pas pu etre approuvee pour la raison suivante :</p>
      <div style="background: #fdf6f4; border-left: 4px solid ${BRAND_COLOR}; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <p style="margin: 0; color: #555;">${reason}</p>
      </div>
      <p>Tu peux soumettre a nouveau tes documents en veillant a corriger le point mentionne ci-dessus.</p>
      ${button("Resoumettre", `${getBaseUrl()}/kyc`)}
    `),
  });
}

// ---------------------------------------------------------------------------
// 14. Profile approved — member notification
// ---------------------------------------------------------------------------

export async function sendProfileApprovedEmail(
  to: string,
  prenom: string,
  businessName: string
) {
  await sendEmail({
    to,
    subject: `Club M — Boutique approuvee`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Boutique approuvee !</h2>
      <p>Bonjour ${prenom},</p>
      <p>Felicitations ! Ton profil business <strong>${businessName}</strong> a ete approuve et est maintenant visible sur la marketplace Club M.</p>
      <p>Tu peux commencer a ajouter tes produits et services depuis ton espace business.</p>
      ${button("Acceder a mon business", `${getBaseUrl()}/mon-business`)}
    `),
  });
}

// ---------------------------------------------------------------------------
// 15. Profile rejected — member notification
// ---------------------------------------------------------------------------

export async function sendProfileRejectedEmail(
  to: string,
  prenom: string,
  businessName: string,
  reason: string
) {
  await sendEmail({
    to,
    subject: `Club M — Profil non approuve`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Profil non approuve</h2>
      <p>Bonjour ${prenom},</p>
      <p>Ton profil business <strong>${businessName}</strong> n'a pas pu etre approuve pour la raison suivante :</p>
      <div style="background: #fdf6f4; border-left: 4px solid ${BRAND_COLOR}; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <p style="margin: 0; color: #555;">${reason}</p>
      </div>
      <p>Tu peux modifier ton profil et le soumettre a nouveau depuis ton espace business.</p>
      ${button("Modifier mon profil", `${getBaseUrl()}/mon-business`)}
    `),
  });
}

// ---------------------------------------------------------------------------
// 16. Ticket confirmation — member notification
// ---------------------------------------------------------------------------

interface TicketEventData {
  title: string;
  date: string;
  location: string;
}

export async function sendTicketConfirmationEmail(
  to: string,
  prenom: string,
  event: TicketEventData
) {
  await sendEmail({
    to,
    subject: `Club M — Billet confirme : ${event.title}`,
    html: emailLayout(`
      <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Billet confirme !</h2>
      <p>Bonjour ${prenom},</p>
      <p>Ton billet pour l'evenement suivant a bien ete enregistre :</p>
      <div style="background: #fdf6f4; border: 1px solid ${BRAND_COLOR}; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: ${BRAND_COLOR};">${event.title}</p>
        <p style="margin: 0 0 4px 0; color: #555;">
          <strong>Date :</strong> ${event.date}
        </p>
        <p style="margin: 0; color: #555;">
          <strong>Lieu :</strong> ${event.location}
        </p>
      </div>
      <p>Retrouve tous tes billets depuis ton espace membre.</p>
      ${button("Voir mes billets", `${getBaseUrl()}/tickets`)}
    `),
  });
}
