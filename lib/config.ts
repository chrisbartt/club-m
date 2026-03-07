// Configuration de l'API backend
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    "https://clubm-main-fvjndh.laravel.cloud/api/v1/",
  TIMEOUT: 30000, // 30 secondes
};
