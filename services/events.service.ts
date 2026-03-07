import { API_CONFIG } from "@/lib/config";
import type { FeedbackFormResponse } from "@/validators/events/notes/feedback-form.validator";

const getBaseUrl = () => {
  const base = API_CONFIG.BASE_URL ?? "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const eventsService = {
  async getFeedbackForm(
    eventId: string,
    token: string
  ): Promise<ApiResponse<FeedbackFormResponse>> {
    try {
      const url = `${getBaseUrl()}/events/${eventId}/feedback-form`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          success: false,
          error: data?.message ?? "Impossible de charger le formulaire",
        };
      }
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur réseau";
      return { success: false, error: message };
    }
  },

  async getEventById(eventId: string): Promise<ApiResponse<{ title: string }>> {
    try {
      const url = `${getBaseUrl()}/events/${eventId}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          success: false,
          error: data?.message ?? "Impossible de charger l'événement",
        };
      }
      const title = data?.data?.title ?? data?.title ?? "";
      return { success: true, data: { title } };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur réseau";
      return { success: false, error: message };
    }
  },
};
