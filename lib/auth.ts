/**
 * Helpers d'auth côté client (localStorage uniquement).
 * L'accès au contenu du site est géré par le mot de passe dans GateView (sans NextAuth ni API).
 */
export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role?: { id: string; label: string } | null;
}

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_REFRESH_TOKEN_KEY = "auth_refresh_token";
const AUTH_USER_KEY = "auth_user";

// Fonctions pour gérer le token d'authentification
export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
};

// Fonctions pour gérer le refresh token
export const setRefreshToken = (refreshToken: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
  }
  return null;
};

export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

// Fonctions pour gérer les informations utilisateur
export const setAuthUser = (user: AuthUser): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

export const getAuthUser = (): AuthUser | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr) as AuthUser;
      } catch {
        return null;
      }
    }
  }
  return null;
};