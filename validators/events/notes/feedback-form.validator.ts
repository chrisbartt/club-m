/**
 * Types pour la réponse API du formulaire de feedback (notes) d'un événement.
 */
export interface FeedbackFormResponse {
  data?: {
    already_submitted?: boolean;
    speakers?: Array<{
      id: string;
      name: string;
      role?: string;
      photo_url?: string;
    }>;
    participant?: {
      name?: string;
      phone?: string;
      email?: string;
    };
  };
  [key: string]: unknown;
}
