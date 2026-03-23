"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const BlockSupportCta = () => {
  return (
    <section className="bg-gradient-to-br from-[#a55b46] to-[#8a4a3a] text-white py-16 md:py-20 px-6 text-center">
      <div className="max-w-[700px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
          Vous n&apos;avez pas trouvé votre réponse ?
        </h2>
        <p className="text-white/90 text-lg mb-8">
          Notre équipe est disponible pour répondre à toutes vos questions.
          N&apos;hésitez pas à nous contacter !
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            asChild
            className="bg-white text-[#a55b46] hover:bg-white/95 hover:shadow-lg rounded-xl px-6 py-6 text-base font-semibold"
          >
            <Link href="/contact">Nous contacter</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-2 border-white/50 text-white hover:bg-white/10 hover:border-white rounded-xl px-6 py-6 text-base font-semibold"
          >
            <Link href="/devenir-membre">Devenir membre</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlockSupportCta;
