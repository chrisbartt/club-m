"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lightbulb, Rocket, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StepsProgress from "./stepsProgress";
import { cn } from "@/lib/utils";

export type FormDataBA = {
  porte: "A" | "B" | "";
  auth: { email: string; password: string; prenom: string; nom: string; telephone: string };
  profil: {
    situation: string;
    disponibilite: string;
    responsabilites: string;
    experience: string;
    objectif: string;
  };
  idee: {
    nom: string;
    description: string;
    stade: string;
    cible: string;
    defis: string;
    doutes: string;
  };
  paiement: { methode: string; montant: number };
  rdv: { date: string; heure: string; plateforme: string };
};

const initialFormData: FormDataBA = {
  porte: "",
  auth: { email: "", password: "", prenom: "", nom: "", telephone: "" },
  profil: {
    situation: "",
    disponibilite: "",
    responsabilites: "",
    experience: "",
    objectif: "",
  },
  idee: {
    nom: "",
    description: "",
    stade: "",
    cible: "",
    defis: "",
    doutes: "",
  },
  paiement: { methode: "", montant: 50 },
  rdv: { date: "", heure: "", plateforme: "" },
};

const FormCommencer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormDataBA>(initialFormData);

  const updateAuth = (key: keyof FormDataBA["auth"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      auth: { ...prev.auth, [key]: value },
    }));
  };
  const updateProfil = (key: keyof FormDataBA["profil"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      profil: { ...prev.profil, [key]: value },
    }));
  };
  const updateIdee = (key: keyof FormDataBA["idee"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      idee: { ...prev.idee, [key]: value },
    }));
  };

  const nextStep = () => {
    if (currentStep < 8) setCurrentStep((s) => s + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const cardBase =
    "rounded-2xl p-6 lg:p-8 border-2 transition-all cursor-pointer text-left bg-white";
  const cardSelected = "border-[#a55b46]";
  const cardDefault = "border-[#E5E7EB] hover:border-[#a55b46]/50";

  return (
    <div className="block-intro lg:py-[80px] py-[40px] bg-[#091626] min-h-screen relative">
      {/* Overlay avec points blancs */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="container px-4 mx-auto max-w-[800px] relative z-10">
        {currentStep <= 7 && (
          <>
            <div className="flex items-center gap-4 mb-8">
              {currentStep === 1 ? (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shrink-0 border-white text-[#091626] hover:bg-white/80  cursor-pointer"
                  asChild
                >
                  <Link href="/parcours/business-aligne">
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shrink-0 border-white text-[#091626] hover:bg-white/10 hover:text-white"
                  onClick={prevStep}
                  type="button"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <h1 className="text-2xl lg:text-3xl font-semibold text-white">
                Business Aligné — Commencer
              </h1>
            </div>
            <StepsProgress currentStep={currentStep} totalSteps={7} />
          </>
        )}

        {/* Étape 1: Porte */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-white">
              Choisis ton point de départ
            </h2>
            <p className="text-white/90">
              Sélectionne le parcours qui correspond le mieux à ta situation
              actuelle
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => {
                  setFormData((p) => ({ ...p, porte: "A" }));
                }}
                className={cn(
                  cardBase,
                  formData.porte === "A" ? cardSelected : cardDefault
                )}
              >
                <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center text-2xl mb-4">
                  <Lightbulb className="w-8 h-8 text-[#a55b46]" />
                </div>
                <h3 className="text-lg font-semibold text-[#091626] mb-2">
                  Porte A
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  J&apos;ai une envie d&apos;entreprendre mais je n&apos;ai pas
                  encore d&apos;idée claire de ce que je veux faire.
                </p>
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#f5f5f5] text-sm text-muted-foreground">
                  Explorer les possibilités
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData((p) => ({ ...p, porte: "B" }));
                }}
                className={cn(
                  cardBase,
                  formData.porte === "B" ? cardSelected : cardDefault
                )}
              >
                <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center text-2xl mb-4">
                  <Rocket className="w-8 h-8 text-[#a55b46]" />
                </div>
                <h3 className="text-lg font-semibold text-[#091626] mb-2">
                  Porte B
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  J&apos;ai déjà une idée de business et je voudrais savoir si
                  elle est viable et réaliste.
                </p>
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#f5f5f5] text-sm text-muted-foreground">
                  Valider mon idée
                </span>
              </button>
            </div>
            <div className="flex gap-4 pt-4">
              <Button className="bg-white text-[#091626] hover:bg-white/80 cursor-pointer" asChild>
                <Link href="/parcours/business-aligne">← Retour</Link>
              </Button>
              <Button
                className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer"
                onClick={nextStep}
                disabled={!formData.porte}
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 2: Auth */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-[#091626]">
              Crée ton compte
            </h2>
            <p className="text-muted-foreground">
              Pour sauvegarder ta progression et accéder à ton espace personnel
            </p>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_10px_24px_#0000000a] space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#091626] mb-4 pb-2 border-b border-[#f5f5f5]">
                  Informations de connexion
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      Adresse email *
                    </label>
                    <Input
                      type="email"
                      placeholder="ton.email@exemple.com"
                      value={formData.auth.email}
                      onChange={(e) => updateAuth("email", e.target.value)}
                      className="rounded-lg border-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      Mot de passe *
                    </label>
                    <Input
                      type="password"
                      placeholder="Minimum 8 caractères"
                      value={formData.auth.password}
                      onChange={(e) => updateAuth("password", e.target.value)}
                      className="rounded-lg border-2"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#091626] mb-4 pb-2 border-b border-[#f5f5f5]">
                  Tes coordonnées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      Prénom *
                    </label>
                    <Input
                      value={formData.auth.prenom}
                      onChange={(e) => updateAuth("prenom", e.target.value)}
                      placeholder="Ton prénom"
                      className="rounded-lg border-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      Nom *
                    </label>
                    <Input
                      value={formData.auth.nom}
                      onChange={(e) => updateAuth("nom", e.target.value)}
                      placeholder="Ton nom"
                      className="rounded-lg border-2"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#091626] mb-2">
                    Téléphone (WhatsApp de préférence)
                  </label>
                  <Input
                    type="tel"
                    value={formData.auth.telephone}
                    onChange={(e) => updateAuth("telephone", e.target.value)}
                    placeholder="+243 XXX XXX XXX"
                    className="rounded-lg border-2"
                  />
                </div>
              </div>
              <div className="p-4 bg-[#f5f5f5] rounded-xl text-sm text-muted-foreground">
                <strong className="text-[#091626]">🔒 Tes données sont protégées</strong>
                <br />
                Nous ne partagerons jamais tes informations avec des tiers sans ton consentement.
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button className="bg-white text-[#091626] hover:bg-white/80 cursor-pointer" onClick={prevStep}>
                ← Retour
              </Button>
              <Button
                className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer"
                onClick={nextStep}
              >
                Créer mon compte <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 3: Profil */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-[#091626]">
              Parle-nous de toi
            </h2>
            <p className="text-muted-foreground">
              Ces informations nous aident à mieux comprendre ta situation
            </p>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_10px_24px_#0000000a] space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#091626] mb-4 pb-2 border-b border-[#f5f5f5]">
                  Ta situation actuelle
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      Quelle est ta situation professionnelle ? *
                    </label>
                    <select
                      value={formData.profil.situation}
                      onChange={(e) =>
                        updateProfil("situation", e.target.value)
                      }
                      className="w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#a55b46] focus:ring-2 focus:ring-[#a55b46]/20 outline-none"
                    >
                      <option value="">Sélectionne une option</option>
                      <option value="salariee">Salariée</option>
                      <option value="independante">Indépendante / Freelance</option>
                      <option value="etudiante">Étudiante</option>
                      <option value="recherche">En recherche d&apos;emploi</option>
                      <option value="entrepreneure">Déjà entrepreneure</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      Combien de temps peux-tu consacrer à ton projet par semaine ? *
                    </label>
                    <select
                      value={formData.profil.disponibilite}
                      onChange={(e) =>
                        updateProfil("disponibilite", e.target.value)
                      }
                      className="w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#a55b46] focus:ring-2 focus:ring-[#a55b46]/20 outline-none"
                    >
                      <option value="">Sélectionne une option</option>
                      <option value="moins5">Moins de 5 heures</option>
                      <option value="5-10">5 à 10 heures</option>
                      <option value="10-20">10 à 20 heures</option>
                      <option value="plus20">Plus de 20 heures</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#091626] mb-4 pb-2 border-b border-[#f5f5f5]">
                  Ton contexte personnel
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      As-tu des responsabilités familiales qui impactent ton temps ? *
                    </label>
                    <select
                      value={formData.profil.responsabilites}
                      onChange={(e) =>
                        updateProfil("responsabilites", e.target.value)
                      }
                      className="w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#a55b46] focus:ring-2 focus:ring-[#a55b46]/20 outline-none"
                    >
                      <option value="">Sélectionne une option</option>
                      <option value="aucune">Non, pas de responsabilités particulières</option>
                      <option value="enfants">Oui, j&apos;ai des enfants à charge</option>
                      <option value="famille">Oui, je m&apos;occupe d&apos;autres membres de ma famille</option>
                      <option value="les_deux">Oui, enfants et autres responsabilités familiales</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      Quel est ton niveau d&apos;expérience en business ? *
                    </label>
                    <select
                      value={formData.profil.experience}
                      onChange={(e) =>
                        updateProfil("experience", e.target.value)
                      }
                      className="w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#a55b46] focus:ring-2 focus:ring-[#a55b46]/20 outline-none"
                    >
                      <option value="">Sélectionne une option</option>
                      <option value="debutante">Débutante - C&apos;est ma première fois</option>
                      <option value="notions">J&apos;ai quelques notions théoriques</option>
                      <option value="experience">J&apos;ai déjà eu une petite activité</option>
                      <option value="confirmee">J&apos;ai plusieurs années d&apos;expérience</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      Quel est ton objectif principal ? *
                    </label>
                    <select
                      value={formData.profil.objectif}
                      onChange={(e) =>
                        updateProfil("objectif", e.target.value)
                      }
                      className="w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#a55b46] focus:ring-2 focus:ring-[#a55b46]/20 outline-none"
                    >
                      <option value="">Sélectionne une option</option>
                      <option value="complement">Avoir un complément de revenus</option>
                      <option value="independance">Devenir indépendante financièrement</option>
                      <option value="impact">Créer un impact social positif</option>
                      <option value="passion">Vivre de ma passion</option>
                      <option value="heritage">Créer quelque chose pour mes enfants</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={prevStep}>
                ← Retour
              </Button>
              <Button
                className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white"
                onClick={nextStep}
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 4: Idée */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-[#091626]">
              Parle-nous de ton projet
            </h2>
            <p className="text-muted-foreground">
              Décris ton idée de business pour que nous puissions l&apos;analyser
            </p>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_10px_24px_#0000000a] space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#091626] mb-4 pb-2 border-b border-[#f5f5f5]">
                  Ton idée de business
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      Comment appellerais-tu ton projet ? *
                    </label>
                    <Input
                      value={formData.idee.nom}
                      onChange={(e) => updateIdee("nom", e.target.value)}
                      placeholder="Ex: BeautyBox, MamaShop..."
                      className="rounded-lg border-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      Décris ton idée en quelques phrases *
                    </label>
                    <textarea
                      value={formData.idee.description}
                      onChange={(e) => updateIdee("description", e.target.value)}
                      placeholder="Explique ce que tu veux faire, quel problème tu veux résoudre..."
                      rows={4}
                      className="w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#a55b46] focus:ring-2 focus:ring-[#a55b46]/20 outline-none resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      À quel stade en es-tu ? *
                    </label>
                    <select
                      value={formData.idee.stade}
                      onChange={(e) => updateIdee("stade", e.target.value)}
                      className="w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#a55b46] focus:ring-2 focus:ring-[#a55b46]/20 outline-none"
                    >
                      <option value="">Sélectionne une option</option>
                      <option value="reflexion">Encore en réflexion</option>
                      <option value="recherche">Je fais des recherches</option>
                      <option value="test">Je teste avec quelques personnes</option>
                      <option value="lance">J&apos;ai déjà commencé à vendre</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#091626] mb-4 pb-2 border-b border-[#f5f5f5]">
                  Ta cible et ton marché
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      Qui sont tes clients potentiels ? *
                    </label>
                    <textarea
                      value={formData.idee.cible}
                      onChange={(e) => updateIdee("cible", e.target.value)}
                      placeholder="Décris les personnes qui pourraient acheter tes produits/services..."
                      rows={3}
                      className="w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#a55b46] focus:ring-2 focus:ring-[#a55b46]/20 outline-none resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      Quels sont les principaux défis que tu anticipes ? *
                    </label>
                    <textarea
                      value={formData.idee.defis}
                      onChange={(e) => updateIdee("defis", e.target.value)}
                      placeholder="Ex: trouver des fournisseurs, me faire connaître..."
                      rows={3}
                      className="w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#a55b46] focus:ring-2 focus:ring-[#a55b46]/20 outline-none resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">
                      Quels sont tes doutes ou questions par rapport à ce projet ? *
                    </label>
                    <textarea
                      value={formData.idee.doutes}
                      onChange={(e) => updateIdee("doutes", e.target.value)}
                      placeholder="Ex: Est-ce que mon idée est viable ?..."
                      rows={3}
                      className="w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#a55b46] focus:ring-2 focus:ring-[#a55b46]/20 outline-none resize-y"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={prevStep}>
                ← Retour
              </Button>
              <Button
                className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white"
                onClick={nextStep}
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 5: Récap */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-[#091626]">
              Vérifie tes informations
            </h2>
            <p className="text-muted-foreground">
              Assure-toi que tout est correct avant de passer au paiement
            </p>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_10px_24px_#0000000a] space-y-6">
              <div className="border-b border-[#E5E7EB] pb-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                  Parcours choisi
                </h4>
                <p className="text-[#091626] font-medium">
                  {formData.porte === "A"
                    ? "Porte A - Explorer les possibilités"
                    : "Porte B - Valider mon idée"}
                </p>
              </div>
              <div className="border-b border-[#E5E7EB] pb-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                  Tes coordonnées
                </h4>
                <p className="text-[#091626]">
                  {formData.auth.prenom} {formData.auth.nom}
                </p>
                <p className="text-muted-foreground text-sm">{formData.auth.email}</p>
                <p className="text-muted-foreground text-sm">{formData.auth.telephone || "—"}</p>
              </div>
              <div className="border-b border-[#E5E7EB] pb-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                  Ton projet
                </h4>
                <p className="text-[#091626] font-medium">{formData.idee.nom || "—"}</p>
                <p className="text-muted-foreground text-sm">{formData.idee.stade || "—"}</p>
              </div>
              <div className="flex justify-between items-center pt-4 text-lg font-bold">
                <span className="text-[#091626]">Montant à payer</span>
                <span className="text-[#a55b46]">50 $</span>
              </div>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
              <strong>✓ Ce qui est inclus :</strong> Analyse complète de ton projet, session de feedback avec Maurelle (1h), document de restitution personnalisé
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={prevStep}>
                ← Modifier
              </Button>
              <Button
                className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer"
                onClick={nextStep}
              >
                Passer au paiement <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 6: Paiement */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-[#091626]">
              Finalise ton inscription
            </h2>
            <p className="text-muted-foreground">
              Choisis ton mode de paiement préféré
            </p>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_10px_24px_#0000000a] space-y-4">
              {[
                { id: "mobile", label: "Mobile Money", desc: "M-Pesa, Airtel Money, Orange Money", icon: "📱" },
                { id: "carte", label: "Carte bancaire", desc: "Visa, Mastercard", icon: "💳" },
                { id: "virement", label: "Virement bancaire", desc: "Transfert direct", icon: "🏦" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      paiement: { ...p.paiement, methode: m.id },
                    }))
                  }
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                    formData.paiement.methode === m.id
                      ? "border-[#a55b46] bg-[#a55b46]/5"
                      : "border-[#E5E7EB] hover:border-[#a55b46]/50"
                  )}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <p className="font-semibold text-[#091626]">{m.label}</p>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-4 pt-4">
              <Button className="bg-white text-[#091626] hover:bg-white/80 cursor-pointer" onClick={prevStep}>
                ← Retour
              </Button>
              <Button
                className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer"
                onClick={nextStep}
                disabled={!formData.paiement.methode}
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 7: RDV */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-[#091626]">
              Réserve ton rendez-vous
            </h2>
            <p className="text-muted-foreground">
              Choisis un créneau pour ta session de feedback avec Maurelle
            </p>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_10px_24px_#0000000a] space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#091626] mb-2">
                  Date souhaitée
                </label>
                <Input
                  type="date"
                  value={formData.rdv.date}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      rdv: { ...p.rdv, date: e.target.value },
                    }))
                  }
                  className="rounded-lg border-2 max-w-xs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#091626] mb-2">
                  Créneaux disponibles
                </label>
                <div className="flex flex-wrap gap-2">
                  {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].map(
                    (h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            rdv: { ...p.rdv, heure: h },
                          }))
                        }
                        className={cn(
                          "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                          formData.rdv.heure === h
                            ? "border-[#a55b46] bg-[#a55b46] text-white"
                            : "border-[#E5E7EB] hover:border-[#a55b46]/50"
                        )}
                      >
                        {h}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#091626] mb-2">
                  Plateforme de visioconférence *
                </label>
                <div className="flex gap-4">
                  {["Zoom", "Google Meet"].map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          rdv: { ...p.rdv, plateforme: plat },
                        }))
                      }
                      className={cn(
                        "flex-1 p-4 rounded-xl border-2 transition-all",
                        formData.rdv.plateforme === plat
                          ? "border-[#a55b46] bg-[#a55b46]/5"
                          : "border-[#E5E7EB] hover:border-[#a55b46]/50"
                      )}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button className="bg-white text-[#091626] hover:bg-white/80 cursor-pointer" onClick={prevStep}>
                ← Retour
              </Button>
              <Button
                className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer"
                onClick={nextStep}
              >
                Confirmer le RDV <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 8: Confirmation */}
        {currentStep === 8 && (
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-[0_10px_24px_#0000000a] text-center">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[#091626] mb-4">
              Félicitations ! 🎉
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Ton inscription au Business Aligné est confirmée. Nous avons hâte de t&apos;accompagner dans cette aventure !
            </p>
            <div className="bg-[#f5f5f5] rounded-xl p-6 text-left mb-8">
              <h4 className="font-semibold text-[#091626] mb-4">Récapitulatif</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Programme</span>
                  <span className="font-medium">Business Aligné</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant payé</span>
                  <span className="font-semibold text-green-600">50 $</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RDV</span>
                  <span>
                    {formData.rdv.date || "—"} à {formData.rdv.heure || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plateforme</span>
                  <span>{formData.rdv.plateforme || "—"}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Tu vas recevoir un email de confirmation avec tous les détails. Le lien de visioconférence te sera envoyé 24h avant le RDV.
            </p>
            <Button
              className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer"
              asChild
            >
              <Link href="/parcours/business-aligne">
                Retour au Business Aligné <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCommencer;
