"use client";

import { useState, useEffect, useCallback } from "react";
import GateView, { isGateUnlocked } from "@/components/features/gateView/GateView";

export default function GateProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setUnlocked(isGateUnlocked()), 0);
    return () => clearTimeout(id);
  }, []);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
  }, []);

  if (unlocked === null) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center min-h-screen w-full bg-[#091626]"
        

      >
        <div className="absolute inset-0 pointer-events-none opacity-20 -z-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
        <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!unlocked) {
    return <GateView onUnlock={handleUnlock} />;
  }

  return <>{children}</>;
}
