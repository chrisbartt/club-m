"use client";

import React from "react";

const STEP_LABELS = [
  "Point de départ",
  "Compte",
  "Profil",
  "Ton projet",
  "Récapitulatif",
  "Paiement",
  "Rendez-vous",
];

interface StepsProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const StepsProgress: React.FC<StepsProgressProps> = ({
  currentStep,
  totalSteps = 7,
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-2">
        <span className="bg-[#a55b46] text-white px-4 py-1.5 rounded-full text-xs font-semibold">
          Étape {currentStep}/{totalSteps}
        </span>
        <span className="text-sm text-white/80 font-medium">
          {Math.round(progressPercentage)}%
        </span>
      </div>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#a55b46] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {STEP_LABELS[currentStep - 1] && (
        <p className="text-xs text-white/70 mt-2 hidden sm:block">
          {STEP_LABELS[currentStep - 1]}
        </p>
      )}
    </div>
  );
};

export default StepsProgress;
