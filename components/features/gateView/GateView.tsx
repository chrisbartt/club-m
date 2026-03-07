"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "admin_clubm_gate_unlocked";
const DEFAULT_PASSWORD = "clubm";

function getExpectedPassword(): string {
  if (typeof window === "undefined") return DEFAULT_PASSWORD;
  return process.env.NEXT_PUBLIC_GATE_PASSWORD ?? DEFAULT_PASSWORD;
}

export function isGateUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function setGateUnlocked(unlocked: boolean): void {
  if (typeof window === "undefined") return;
  if (unlocked) localStorage.setItem(STORAGE_KEY, "true");
  else localStorage.removeItem(STORAGE_KEY);
}

interface GateViewProps {
  onUnlock: () => void;
}

export default function GateView({ onUnlock }: GateViewProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);
      const expected = getExpectedPassword();
      if (password === expected) {
        setGateUnlocked(true);
        onUnlock();
      } else {
        setError("Mot de passe incorrect.");
        setLoading(false);
      }
    },
    [password, onUnlock]
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center min-h-screen w-full overflow-auto bg-[#091626]"
     
    >
      <div className="absolute inset-0 pointer-events-none opacity-20 -z-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
      <div className="flex flex-col items-center justify-center px-6 py-12 max-w-md w-full">
        <Image
          src="/logos/logo1.png"
          alt="Club M"
          width={180}
          height={180}
          className="object-contain mb-8"
          style={{ filter: "brightness(0) invert(1)" }}
          priority
        />
        <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-2">
          Bienvenue
        </h1>
        <p className="text-white/80 text-center text-sm md:text-base mb-8">
          Entrez le mot de passe pour accéder au site
        </p>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Mot de passe"
            className="h-12 rounded-xl backdrop-blur-lg bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30 focus-visible:border-white/40 text-center"
            autoFocus
            autoComplete="current-password"
            disabled={loading}
          />
          {error && (
            <p className="text-sm text-red-300 text-center">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#a55b46] text-white hover:bg-[#a55b46]/80 font-semibold cursor-pointer"
            disabled={loading}
          >
            {loading ? "Validation…" : "Valider"}
          </Button>
        </form>
      </div>
    </div>
  );
}
