"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const BlockSupportHero = () => {
  const [query, setQuery] = useState("");

  return (
    <section className="bg-[#091626] text-white py-14 md:py-24 lg:py-28 px-4 md:px-6 text-center">
      <div className="max-w-[700px] mx-auto">
        <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-6">
          Centre d&apos;aide
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold font-serif mb-4">
          Comment pouvons-nous{" "}
          <span className="text-[#e1c593]">vous aider</span> ?
        </h1>
        <p className="text-white/85 text-base md:text-lg mb-6 md:mb-8">
          Trouvez rapidement des réponses à vos questions ou contactez notre
          équipe support.
        </p>
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
          <Input
            type="text"
            placeholder="Rechercher dans l'aide (ex: inscription, paiement, événement...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-4 py-4 rounded-xl border-0 bg-white text-[#1a1a1a] shadow-lg focus-visible:ring-2 focus-visible:ring-[#e1c593]"
          />
        </div>
      </div>
    </section>
  );
};

export default BlockSupportHero;
