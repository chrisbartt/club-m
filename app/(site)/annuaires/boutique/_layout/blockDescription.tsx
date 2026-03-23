import React from "react";

const BlockDescription = () => {
  return (
    <div className="block-description bg-white lg:py-[100px] lg:pt-[70px] py-[50px]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12">
          <div className="col-span-2"></div>
          <div className="col-span-12 lg:col-span-8">
            <h2 className="text-2xl lg:text-4xl font-medium text-[#091626] mb-2 lg:mb-4 tracking-[-0.02em]">
              Description du produit
            </h2>
            <p className="text-muted-foreground md:mb-3 lg:text-[18px] text-[16px]">
              Ce produit répond aux besoins des professionnels et des particuliers
              qui recherchent un accompagnement de qualité, adapté à leur contexte
              et à leurs objectifs. Il combine expertise terrain et méthodologie
              éprouvée pour vous accompagner de A à Z.
            </p>
            <p className="text-muted-foreground md:mb-3 lg:text-[18px] text-[16px]">
              Que vous soyez en phase de lancement, de structuration ou
              d&apos;optimisation, l&apos;offre est conçue pour s&apos;adapter à
              votre rythme et à votre budget. Les livrables sont clairs, les
              échéances définies ensemble, et un suivi personnalisé est assuré
              tout au long de la prestation.
            </p>
            <h3 className="text-xl font-semibold text-[#091626] mt-6 mb-2">
              Ce qui est inclus
            </h3>
            <ul className="text-muted-foreground lg:text-[18px] text-[16px] space-y-2 list-disc list-inside md:mb-3">
              <li>Analyse de votre situation et définition des objectifs</li>
              <li>Accompagnement sur-mesure selon votre secteur d&apos;activité</li>
              <li>Livrables concrets (documents, plans, recommandations)</li>
              <li>Échanges réguliers et suivi jusqu&apos;à la livraison</li>
            </ul>
            <p className="text-muted-foreground md:mb-3 lg:text-[18px] text-[16px] mt-4">
              N&apos;hésitez pas à me contacter pour en discuter et adapter
              l&apos;offre à votre projet. Je reste à votre disposition pour
              toute question.
            </p>
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockDescription;
