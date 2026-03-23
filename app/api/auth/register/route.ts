import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Plan } from "@/lib/generated/prisma/enums";
import { sendWelcomeEmail } from "@/lib/email";

const registerSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  plan: z.enum(["free", "premium", "business"]).default("free"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const planMap: Record<string, Plan> = {
      free: Plan.FREE,
      premium: Plan.PREMIUM,
      business: Plan.BUSINESS,
    };

    const user = await prisma.user.create({
      data: {
        prenom: data.prenom.trim(),
        nom: data.nom.trim(),
        email: data.email.toLowerCase().trim(),
        telephone: data.telephone.trim(),
        passwordHash,
        plan: planMap[data.plan],
      },
    });

    // Create subscription for paid plans
    if (data.plan !== "free") {
      const amounts: Record<string, number> = {
        premium: 90,
        business: 180,
      };
      const durations: Record<string, number> = {
        premium: 3,
        business: 6,
      };
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + durations[data.plan]);

      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: planMap[data.plan],
          amount: amounts[data.plan],
          currency: "USD",
          expiresAt,
        },
      });
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.prenom).catch(console.error);

    return NextResponse.json(
      {
        userId: user.id,
        message: "Inscription réussie. Soumettez vos documents de vérification.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error("[REGISTER]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
