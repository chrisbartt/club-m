"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthToken } from "@/lib/auth";

// Composant pour gérer l'expiration de session
function SessionExpirationHandler({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Vérifier si on est côté client pour éviter les problèmes d'hydratation
  const isClient = typeof window !== "undefined";

  useEffect(() => {
    // Ne rien faire si on est côté serveur
    if (!isClient) return;
    // Nettoyer l'intervalle précédent
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }

    // Vérifier si le token dans le localStorage existe
    // Si la session NextAuth existe mais pas le token, déconnecter
    const token = getAuthToken();
    const hasToken = !!token;

    // Si la session NextAuth existe mais pas de token, déconnecter
    if (status === "authenticated" && !hasToken) {
      console.warn("⚠️ [CLIENT] Session NextAuth existe mais pas de token, déconnexion...");
      const isAdminRoute = pathname?.startsWith("/admin");
      if (isAdminRoute) {
        signOut({ redirect: false }).then(() => {
          router.push("/login");
          router.refresh();
        });
      }
      return;
    }

    // Vérifier si la session est expirée ou invalide
    if (status === "unauthenticated") {
      // Ne rediriger vers /login QUE si on est sur une route admin
      // Les routes publiques (/, /devenir-membre, /formulaire-membre, etc.) doivent rester accessibles
      const isAdminRoute = pathname?.startsWith("/admin");
      const isLoginRoute = pathname?.startsWith("/login");
      const isApiRoute = pathname?.startsWith("/api");

      if (isAdminRoute && !isLoginRoute && !isApiRoute) {
        console.log(
          "⚠️ [CLIENT] Session expirée sur route admin, redirection vers /login"
        );
        signOut({ redirect: false }).then(() => {
          router.push("/login");
          router.refresh();
        });
      }
    } else if (status === "authenticated" && session && hasToken) {
      // Vérifier périodiquement si la session a expiré
      const checkExpiration = () => {
        if (session.expires) {
          const expiresAt = new Date(session.expires);
          const now = new Date();

          // Si la session expire dans moins de 1 minute, ou est déjà expirée
          const timeUntilExpiry = expiresAt.getTime() - now.getTime();

          if (timeUntilExpiry <= 0) {
            // Ne rediriger que si on est sur une route admin
            const isAdminRoute = pathname?.startsWith("/admin");
            if (isAdminRoute) {
              console.log(
                "⚠️ [CLIENT] Session expirée sur route admin, redirection vers /login"
              );
              signOut({ redirect: false }).then(() => {
                router.push("/login");
                router.refresh();
              });
            }
          } else if (timeUntilExpiry < 60000) {
            // Avertir si la session expire dans moins d'1 minute
            console.log(
              "⚠️ [CLIENT] Session expire bientôt dans",
              Math.round(timeUntilExpiry / 1000),
              "secondes"
            );
          }
        }
      };

      // Vérifier immédiatement
      checkExpiration();

      // Vérifier toutes les 30 secondes
      checkIntervalRef.current = setInterval(checkExpiration, 30000);
    }

    // Nettoyer l'intervalle au démontage
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [status, session, router, pathname, isClient]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      basePath="/api/auth"
      refetchInterval={60} // Vérifier la session toutes les 60 secondes
      refetchOnWindowFocus={true} // Vérifier aussi quand la fenêtre reprend le focus
    >
      <SessionExpirationHandler>{children}</SessionExpirationHandler>
    </SessionProvider>
  );
}
