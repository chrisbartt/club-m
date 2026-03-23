"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export interface CurrentUser {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  plan: "FREE" | "PREMIUM" | "BUSINESS";
  status: string;
  avatar: string | null;
  bio: string | null;
  secteur: string | null;
  ville: string | null;
  pays: string | null;
  siteWeb: string | null;
  instagram: string | null;
  linkedin: string | null;
  createdAt: string;
  verification: {
    aiResult: string;
    adminDecision: string | null;
    createdAt: string;
  } | null;
  subscriptions: {
    plan: string;
    startsAt: string;
    expiresAt: string | null;
    status: string;
  }[];
}

export function useCurrentUser() {
  const { data: session, status: sessionStatus } = useSession();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (sessionStatus === "unauthenticated" || !session?.user) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/membre/me");
        if (!res.ok) {
          setError("Impossible de charger le profil");
          setIsLoading(false);
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        setError("Erreur de connexion");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [session, sessionStatus]);

  const initials = user
    ? `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase()
    : "";

  const fullName = user ? `${user.prenom} ${user.nom}` : "";

  const planLabel =
    user?.plan === "BUSINESS"
      ? "Business"
      : user?.plan === "PREMIUM"
        ? "Premium"
        : "Free";

  return {
    user,
    isLoading,
    error,
    isAuthenticated: sessionStatus === "authenticated",
    initials,
    fullName,
    planLabel,
  };
}
