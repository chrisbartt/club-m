"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

// Composant pour gérer l'expiration de session
function SessionExpirationHandler({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }

    const isProtectedRoute =
      pathname?.startsWith("/admin") || pathname?.startsWith("/membre");
    const isLoginRoute = pathname?.startsWith("/login");

    // Si non authentifié sur une route protégée, rediriger vers /login
    if (status === "unauthenticated" && isProtectedRoute && !isLoginRoute) {
      signOut({ redirect: false }).then(() => {
        router.push("/login");
        router.refresh();
      });
    } else if (status === "authenticated" && session) {
      // Vérifier périodiquement si la session a expiré
      const checkExpiration = () => {
        if (session.expires) {
          const expiresAt = new Date(session.expires);
          const now = new Date();
          const timeUntilExpiry = expiresAt.getTime() - now.getTime();

          if (timeUntilExpiry <= 0 && isProtectedRoute) {
            signOut({ redirect: false }).then(() => {
              router.push("/login");
              router.refresh();
            });
          }
        }
      };

      checkExpiration();
      checkIntervalRef.current = setInterval(checkExpiration, 30000);
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [status, session, router, pathname]);

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
