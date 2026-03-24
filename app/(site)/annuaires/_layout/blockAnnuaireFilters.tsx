"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BlockAnnuaireFiltersProps {
  onSearch?: (q: string) => void;
  onCategory?: (v: string) => void;
  searchPlaceholder?: string;
}

const BlockAnnuaireFilters = ({
  onSearch,
  onCategory,
  searchPlaceholder = "Rechercher un service (ex : création logo, gestion Instagram…)",
}: BlockAnnuaireFiltersProps) => {
  const [query, setQuery] = useState("");

  return (
    <section className="bg-white py-6 border-b border-black/5 sticky top-0 z-20 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 rounded-xl bg-[#f8f9fa] border-2 border-transparent focus-within:border-[#a55b46] focus-within:ring-2 focus-within:ring-[#a55b46]/10 mb-5">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0"
          />
          <Button
            type="button"
            className="bg-[#a55b46] hover:bg-[#8a4a3a] text-white rounded-xl"
            onClick={() => onSearch?.(query)}
          >
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm text-[#1f2937] focus:border-[#a55b46] focus:outline-none focus:ring-2 focus:ring-[#a55b46]/10"
            onChange={(e) => onCategory?.(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            <option value="comptabilite">Comptabilité & Finance</option>
            <option value="marketing">Marketing & Communication</option>
            <option value="juridique">Juridique & Administratif</option>
            <option value="digital">Digital & Tech</option>
            <option value="coaching">Coaching & Mindset</option>
            <option value="formation">Formation & Ateliers</option>
          </select>
          <select
            className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm text-[#1f2937] focus:border-[#a55b46] focus:outline-none"
          >
            <option value="">Tous les prix</option>
            <option value="low">$ Accessible</option>
            <option value="medium">$$ Standard</option>
            <option value="high">$$$ Premium</option>
          </select>
          <select
            className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm text-[#1f2937] focus:border-[#a55b46] focus:outline-none"
          >
            <option value="">Tous les types</option>
            <option value="oneshot">One shot</option>
            <option value="monthly">Abonnement mensuel</option>
            <option value="project">Pack projet</option>
          </select>
          <div className="flex gap-2 ml-auto">
            {["Pertinence", "Mieux notées", "Plus récentes"].map((label, i) => (
              <button
                key={label}
                type="button"
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                  i === 0
                    ? "bg-[#a55b46] border-[#a55b46] text-white"
                    : "border-black/10 text-[#6b7280] hover:border-[#a55b46] hover:text-[#a55b46]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockAnnuaireFilters;
