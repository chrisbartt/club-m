"use client";

import React, { useState, useEffect } from 'react';

const sections = [
  { id: "etape-1", title: "Business Aligné", subtitle: "Étape 1" },
  { id: "etape-2", title: "Ateliers & Masterclass", subtitle: "Étape 2" },
  { id: "etape-3", title: "Annuaire Business", subtitle: "Étape 3" },
];

const FixedNavParcous = () => {
  const [activeSection, setActiveSection] = useState<string>("etape-1");
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const lastSection = sections[sections.length - 1];
      const lastElement = document.getElementById(lastSection.id);

      // Vérifier si on a dépassé la dernière section
      if (lastElement) {
        const lastElementBottom = lastElement.offsetTop + lastElement.offsetHeight;
        
        // Si on a dépassé la dernière section, masquer le composant
        if (window.scrollY > lastElementBottom) {
          setIsVisible(false);
          return;
        } else {
          setIsVisible(true);
        }
      }

      // Détecter la section active
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset pour le header fixe
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div 
      className={`fixed top-1/2 -translate-y-1/2 hidden md:block -right-20 w-full z-50 pointer-events-none transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex justify-end">
          <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-4 w-[190px] pointer-events-auto transition-opacity duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* En-tête */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-[#091626] uppercase">
                PARCOURS
              </h3>
            </div>

            {/* Liste de navigation */}
            <ul className="space-y-4">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className="w-full text-left flex items-start gap-3 group cursor-pointer transition-colors"
                    >
                      {/* Cercle indicateur */}
                      <div className="mt-1 shrink-0">
                        <div
                          className={`w-4 h-4 rounded-full border-2 transition-all ${
                            isActive
                              ? "bg-[#a55b46] border-[#a55b46]"
                              : "border-gray-400 group-hover:border-[#a55b46]"
                          }`}
                        />
                      </div>

                      {/* Texte */}
                      <div className="flex-1">
                        <h4
                          className={`text-sm font-semibold mb-1 transition-colors ${
                            isActive
                              ? "text-[#a55b46]"
                              : "text-[#091626] group-hover:text-[#a55b46]"
                          }`}
                        >
                          {section.title}
                        </h4>
                        <p
                          className={`text-xs transition-colors ${
                            isActive
                              ? "text-[#a55b46]"
                              : "text-muted-foreground group-hover:text-gray-700"
                          }`}
                        >
                          {section.subtitle}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedNavParcous;
