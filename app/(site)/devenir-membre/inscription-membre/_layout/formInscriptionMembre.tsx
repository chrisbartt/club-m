"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, HelpCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StepsProgressInscription from "./stepsProgressInscription";
import { cn } from "@/lib/utils";

export type FormDataInscription = {
  plan: { name: string; price: number };
  info: {
    prenom: string;
    nom: string;
    dateNaissance: string;
    email: string;
    telephone: string;
    ville: string;
    password: string;
    passwordConfirm: string;
  };
  profil: {
    situation: string;
    stade: string;
    secteur: string;
    attentes: string;
    source: string;
  };
  paiement: { methode: string };
};

const initialFormData: FormDataInscription = {
  plan: { name: "", price: 0 },
  info: {
    prenom: "",
    nom: "",
    dateNaissance: "",
    email: "",
    telephone: "",
    ville: "",
    password: "",
    passwordConfirm: "",
  },
  profil: {
    situation: "",
    stade: "",
    secteur: "",
    attentes: "",
    source: "",
  },
  paiement: { methode: "" },
};

const VILLES = [
  { value: "kinshasa", label: "Kinshasa" },
  { value: "lubumbashi", label: "Lubumbashi" },
  { value: "mbuji-mayi", label: "Mbuji-Mayi" },
  { value: "kananga", label: "Kananga" },
  { value: "kisangani", label: "Kisangani" },
  { value: "goma", label: "Goma" },
  { value: "bukavu", label: "Bukavu" },
  { value: "autre", label: "Autre ville RDC" },
  { value: "etranger", label: "Hors RDC" },
];

const SITUATIONS = [
  { value: "salariee", label: "Salariée" },
  { value: "independante", label: "Indépendante / Freelance" },
  { value: "etudiante", label: "Étudiante" },
  { value: "recherche", label: "En recherche d'emploi" },
  { value: "entrepreneure", label: "Déjà entrepreneure" },
  { value: "autre", label: "Autre" },
];

const STADES = [
  { value: "idee", label: "J'ai une idée", desc: "Je réfléchis à un projet mais je n'ai pas encore commencé", icon: "💭" },
  { value: "preparation", label: "En préparation", desc: "Je structure mon projet et fais des recherches", icon: "📝" },
  { value: "lance", label: "Déjà lancée", desc: "J'ai un business actif que je veux développer", icon: "🚀" },
  { value: "aucun", label: "Je cherche encore", desc: "Je veux entreprendre mais je n'ai pas d'idée précise", icon: "🔍" },
];

const SECTEURS = [
  { value: "beaute", label: "Beauté & Cosmétiques" },
  { value: "mode", label: "Mode & Textile" },
  { value: "alimentation", label: "Alimentation & Restauration" },
  { value: "services", label: "Services aux particuliers" },
  { value: "tech", label: "Technologie & Digital" },
  { value: "education", label: "Éducation & Formation" },
  { value: "sante", label: "Santé & Bien-être" },
  { value: "commerce", label: "Commerce général" },
  { value: "artisanat", label: "Artisanat & Création" },
  { value: "autre", label: "Autre secteur" },
];

const SOURCES = [
  { value: "reseaux", label: "Réseaux sociaux" },
  { value: "amie", label: "Recommandation d'une amie" },
  { value: "evenement", label: "Événement / Conférence" },
  { value: "recherche", label: "Recherche internet" },
  { value: "presse", label: "Presse / Média" },
  { value: "autre", label: "Autre" },
];

const getInitialFormDataFromUrl = (): FormDataInscription => {
  if (typeof window === "undefined") return initialFormData;
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan");
  if (plan === "essentielle") return { ...initialFormData, plan: { name: "essentielle", price: 10 } };
  if (plan === "premium") return { ...initialFormData, plan: { name: "premium", price: 25 } };
  return initialFormData;
};

const FormInscriptionMembre = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormDataInscription>(getInitialFormDataFromUrl);

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep((s) => s + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const updateInfo = (key: keyof FormDataInscription["info"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      info: { ...prev.info, [key]: value },
    }));
  };
  const updateProfil = (key: keyof FormDataInscription["profil"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      profil: { ...prev.profil, [key]: value },
    }));
  };

  const cardBase = "rounded-2xl p-6 lg:p-8 border-2 transition-all cursor-pointer text-left bg-white";
  const cardSelected = "border-[#a55b46]";
  const cardDefault = "border-[#E5E7EB] hover:border-[#a55b46]/50";

  const selectClassName =
    "w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#a55b46] focus:ring-2 focus:ring-[#a55b46]/20 outline-none";

  const getProchaineEcheance = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  const getVilleLabel = (v: string) => VILLES.find((x) => x.value === v)?.label ?? v;
  const getSituationLabel = (v: string) => SITUATIONS.find((x) => x.value === v)?.label ?? v;
  const getStadeLabel = (v: string) => STADES.find((x) => x.value === v)?.label ?? v;
  const getSecteurLabel = (v: string) => SECTEURS.find((x) => x.value === v)?.label ?? v;
  const getSourceLabel = (v: string) => SOURCES.find((x) => x.value === v)?.label ?? v;

  return (
    <div className="block-intro lg:py-[80px] py-[40px] bg-[#091626] min-h-screen relative">
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="container px-4 mx-auto max-w-[800px] relative z-10">
        {currentStep <= 5 && (
          <>
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                {currentStep === 1 ? (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full shrink-0 border-white text-[#091626] hover:bg-white/10 hover:text-white"
                    asChild
                  >
                    <Link href="/devenir-membre">
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full shrink-0 border-white text-white hover:bg-white/10 hover:text-white"
                    onClick={prevStep}
                    type="button"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <h1 className="text-2xl lg:text-3xl font-semibold text-white">
                  Inscription Membre
                </h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/90 hover:text-white hover:bg-white/10 shrink-0"
                asChild
              >
                <Link href="/devenir-membre" className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Besoin d&apos;aide ?
                </Link>
              </Button>
            </div>
            <StepsProgressInscription currentStep={currentStep} totalSteps={5} />
          </>
        )}

        {/* Étape 1: Choix formule */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-white">
              Choisis ta formule
            </h2>
            <p className="text-white/90">
              Sélectionne l&apos;adhésion qui correspond le mieux à tes besoins
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, plan: { name: "essentielle", price: 10 } }))}
                className={cn(cardBase, formData.plan.name === "essentielle" ? cardSelected : cardDefault)}
              >
                <div className="text-center mb-6 pb-6 border-b border-[#E5E7EB]">
                  <h3 className="text-xl font-bold text-[#091626] mb-2">Essentielle</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-lg font-semibold">$</span>
                    <span className="text-4xl font-extrabold text-[#a55b46]">10</span>
                    <span className="text-sm text-muted-foreground">/ mois</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-sm text-[#1f2937]">
                  {["Accès à la communauté privée", "Annuaire des membres", "1 événement mensuel", "Accès au Business Aligné"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-muted-foreground line-through">
                    <span className="w-5 h-5 rounded-full bg-[#f5f5f5] text-muted-foreground flex items-center justify-center text-xs">✕</span>
                    Accompagnement personnalisé
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground line-through">
                    <span className="w-5 h-5 rounded-full bg-[#f5f5f5] text-muted-foreground flex items-center justify-center text-xs">✕</span>
                    Ateliers avancés
                  </li>
                </ul>
              </button>

              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, plan: { name: "premium", price: 25 } }))}
                className={cn(cardBase, formData.plan.name === "premium" ? cardSelected : cardDefault, "relative")}
              >
                <span className="absolute -top-3 right-5 bg-[#a55b46] text-white px-4 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" /> Recommandé
                </span>
                <div className="text-center mb-6 pb-6 border-b border-[#E5E7EB]">
                  <h3 className="text-xl font-bold text-[#091626] mb-2">Premium</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-lg font-semibold">$</span>
                    <span className="text-4xl font-extrabold text-[#a55b46]">25</span>
                    <span className="text-sm text-muted-foreground">/ mois</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-sm text-[#1f2937]">
                  {["Tout de Essentielle +", "Accompagnement personnalisé", "Ateliers avancés exclusifs", "Visibilité premium dans l'annuaire", "Tous les événements", "Support prioritaire"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            </div>
            <div className="flex gap-4 pt-4">
              <Button className="bg-white text-[#091626] hover:bg-white/80 cursor-pointer" asChild>
                <Link href="/devenir-membre">← Retour</Link>
              </Button>
              <Button
                className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer"
                onClick={nextStep}
                disabled={!formData.plan.name}
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 2: Informations personnelles */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-white">
              Tes informations
            </h2>
            <p className="text-white/90">
              Ces informations nous permettent de créer ton compte membre
            </p>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_10px_24px_#0000000a] space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#091626] mb-4 pb-2 border-b border-[#f5f5f5]">
                  Identité
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">Prénom *</label>
                    <Input
                      value={formData.info.prenom}
                      onChange={(e) => updateInfo("prenom", e.target.value)}
                      placeholder="Ton prénom"
                      className="rounded-lg border-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">Nom *</label>
                    <Input
                      value={formData.info.nom}
                      onChange={(e) => updateInfo("nom", e.target.value)}
                      placeholder="Ton nom"
                      className="rounded-lg border-2"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#091626] mb-2">Date de naissance</label>
                  <Input
                    type="date"
                    value={formData.info.dateNaissance}
                    onChange={(e) => updateInfo("dateNaissance", e.target.value)}
                    className="rounded-lg border-2"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#091626] mb-4 pb-2 border-b border-[#f5f5f5]">
                  Contact
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">Adresse email *</label>
                    <Input
                      type="email"
                      value={formData.info.email}
                      onChange={(e) => updateInfo("email", e.target.value)}
                      placeholder="ton.email@exemple.com"
                      className="rounded-lg border-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">Téléphone (WhatsApp de préférence) *</label>
                    <Input
                      type="tel"
                      value={formData.info.telephone}
                      onChange={(e) => updateInfo("telephone", e.target.value)}
                      placeholder="+243 XXX XXX XXX"
                      className="rounded-lg border-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">Ville / Province *</label>
                    <select
                      value={formData.info.ville}
                      onChange={(e) => updateInfo("ville", e.target.value)}
                      className={selectClassName}
                    >
                      <option value="">Sélectionne ta ville</option>
                      {VILLES.map((v) => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#091626] mb-4 pb-2 border-b border-[#f5f5f5]">
                  Sécurité
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">Mot de passe *</label>
                    <Input
                      type="password"
                      value={formData.info.password}
                      onChange={(e) => updateInfo("password", e.target.value)}
                      placeholder="Minimum 8 caractères"
                      minLength={8}
                      className="rounded-lg border-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">Confirmer le mot de passe *</label>
                    <Input
                      type="password"
                      value={formData.info.passwordConfirm}
                      onChange={(e) => updateInfo("passwordConfirm", e.target.value)}
                      placeholder="Répète ton mot de passe"
                      className="rounded-lg border-2"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-[#f5f5f5] rounded-xl text-sm text-muted-foreground">
                <strong className="text-[#091626]">🔒 Tes données sont protégées</strong>
                <br />
                Nous ne partagerons jamais tes informations avec des tiers sans ton consentement.
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button  className="bg-white text-[#091626] hover:bg-white/80 cursor-pointer" onClick={prevStep}>← Retour</Button>
              <Button className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer" onClick={nextStep}>
                Continuer <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 3: Profil entrepreneurial */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-white">
              Ton profil entrepreneur
            </h2>
            <p className="text-white/90">
              Aide-nous à mieux te connaître pour personnaliser ton accompagnement
            </p>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_10px_24px_#0000000a] space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#091626] mb-4 pb-2 border-b border-[#f5f5f5]">
                  Ta situation actuelle
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">Quelle est ta situation professionnelle ? *</label>
                    <select
                      value={formData.profil.situation}
                      onChange={(e) => updateProfil("situation", e.target.value)}
                      className={selectClassName}
                    >
                      <option value="">Sélectionne une option</option>
                      {SITUATIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">Où en es-tu dans ton parcours entrepreneurial ? *</label>
                    <div className="space-y-3">
                      {STADES.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => updateProfil("stade", s.value)}
                          className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                            formData.profil.stade === s.value ? "border-[#a55b46] bg-[#a55b46]/5" : "border-[#E5E7EB] hover:border-[#a55b46]/50"
                          )}
                        >
                          <span
                            className={cn(
                              "w-11 h-11 rounded-lg flex items-center justify-center text-xl shrink-0",
                              formData.profil.stade === s.value ? "bg-[#a55b46]" : "bg-[#f5f5f5]"
                            )}
                          >
                            {s.icon}
                          </span>
                          <div>
                            <p className="font-medium text-[#091626]">{s.label}</p>
                            <p className="text-sm text-muted-foreground">{s.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#091626] mb-4 pb-2 border-b border-[#f5f5f5]">
                  Tes centres d&apos;intérêt
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">Quel(s) secteur(s) t&apos;intéresse(nt) ? *</label>
                    <select
                      value={formData.profil.secteur}
                      onChange={(e) => updateProfil("secteur", e.target.value)}
                      className={selectClassName}
                    >
                      <option value="">Sélectionne un secteur</option>
                      {SECTEURS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091626] mb-2">Qu&apos;attends-tu principalement du Club M ?</label>
                    <textarea
                      value={formData.profil.attentes}
                      onChange={(e) => updateProfil("attentes", e.target.value)}
                      placeholder="Ex: Trouver du financement, structurer mon projet, rencontrer d'autres entrepreneures..."
                      rows={3}
                      className="w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#a55b46] focus:ring-2 focus:ring-[#a55b46]/20 outline-none resize-y"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#091626] mb-4 pb-2 border-b border-[#f5f5f5]">
                  Comment nous as-tu connues ?
                </h3>
                <select
                  value={formData.profil.source}
                  onChange={(e) => updateProfil("source", e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Sélectionne une option</option>
                  {SOURCES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button className="bg-white text-[#091626] hover:bg-white/80 cursor-pointer" onClick={prevStep}>← Retour</Button>
              <Button className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer" onClick={nextStep}>
                Continuer <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 4: Récapitulatif */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-white">
              Récapitulatif
            </h2>
            <p className="text-white/90">
              Vérifie tes informations avant de passer au paiement
            </p>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_10px_24px_#0000000a] space-y-6">
              <div className="border-b border-[#E5E7EB] pb-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">📋 Formule choisie</h4>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Adhésion</span>
                  <span className="font-semibold text-[#091626] capitalize">{formData.plan.name || "—"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Durée</span>
                  <span className="font-medium">Mensuel (renouvelable)</span>
                </div>
              </div>
              <div className="border-b border-[#E5E7EB] pb-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">👤 Tes informations</h4>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Nom complet</span>
                  <span className="font-medium">{formData.info.prenom || "—"} {formData.info.nom || ""}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Email</span>
                  <span>{formData.info.email || "—"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Téléphone</span>
                  <span>{formData.info.telephone || "—"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Ville</span>
                  <span>{getVilleLabel(formData.info.ville) || "—"}</span>
                </div>
              </div>
              <div className="border-b border-[#E5E7EB] pb-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">💼 Ton profil</h4>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Situation</span>
                  <span>{getSituationLabel(formData.profil.situation) || "—"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Stade entrepreneurial</span>
                  <span>{getStadeLabel(formData.profil.stade) || "—"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Secteur d&apos;intérêt</span>
                  <span>{getSecteurLabel(formData.profil.secteur) || "—"}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 text-lg font-bold">
                <span className="text-[#091626]">Montant à payer</span>
                <span className="text-[#a55b46]">{formData.plan.price} $ / mois</span>
              </div>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
              <strong>✓ Ce qui est inclus :</strong> Accès immédiat à ton espace membre, tous les avantages de ta formule, support WhatsApp
            </div>
            <div className="flex gap-4 pt-4">
              <Button className="bg-white text-[#091626] hover:bg-white/80 cursor-pointer" onClick={prevStep}>← Modifier</Button>
              <Button className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer" onClick={nextStep}>
                Passer au paiement <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 5: Paiement */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-white">
              Finalise ton inscription
            </h2>
            <p className="text-white/90">
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
                  onClick={() => setFormData((p) => ({ ...p, paiement: { methode: m.id } }))}
                  className={cn(
                    "w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left",
                    formData.paiement.methode === m.id ? "border-[#a55b46] bg-[#a55b46]/5" : "border-[#E5E7EB] hover:border-[#a55b46]/50"
                  )}
                >
                  <span
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                      formData.paiement.methode === m.id ? "bg-[#a55b46]" : "bg-[#f5f5f5]"
                    )}
                  >
                    {m.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-[#091626]">{m.label}</p>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </button>
              ))}
              {formData.paiement.methode === "mobile" && (
                <div className="mt-6 p-4 bg-[#f5f5f5] rounded-xl text-sm">
                  <h4 className="font-semibold text-[#091626] mb-3">Instructions Mobile Money</h4>
                  <p className="text-muted-foreground mb-2">Envoie <strong className="text-[#091626]">{formData.plan.price} $</strong> au numéro suivant :</p>
                  <div className="bg-white py-4 rounded-lg text-center text-xl font-bold text-[#091626] mb-3">+243 XXX XXX XXX</div>
                  <p className="text-muted-foreground text-xs">Nom du bénéficiaire : <strong>Club M SARL</strong></p>
                </div>
              )}
              {formData.paiement.methode === "virement" && (
                <div className="mt-6 p-4 bg-[#f5f5f5] rounded-xl text-sm">
                  <h4 className="font-semibold text-[#091626] mb-3">Coordonnées bancaires</h4>
                  <p><strong>Banque :</strong> Rawbank</p>
                  <p><strong>Compte :</strong> 05100-05100100100-84 USD</p>
                  <p><strong>Bénéficiaire :</strong> Club M SARL</p>
                  <p><strong>Référence :</strong> MEMBRE-2026-XXXX</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <strong>💡 Bon à savoir :</strong> Ton adhésion sera activée dès confirmation du paiement. Tu recevras un email de confirmation.
            </div>
            <div className="flex gap-4 pt-4">
              <Button className="bg-white text-[#091626] hover:bg-white/80 cursor-pointer" onClick={prevStep}>← Retour</Button>
              <Button
                className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer"
                onClick={nextStep}
                disabled={!formData.paiement.methode}
              >
                Confirmer le paiement <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 6: Confirmation */}
        {currentStep === 6 && (
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-[0_10px_24px_#0000000a] text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#66a381] to-[#34D399] flex items-center justify-center mx-auto mb-6 text-white text-5xl font-bold">
              ✓
            </div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[#091626] mb-4">
              Bienvenue au Club M ! 🎉
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              Ton inscription est confirmée. Tu fais maintenant partie d&apos;une communauté de femmes entrepreneures exceptionnelles.
            </p>
            <div className="bg-[#f5f5f5] rounded-xl p-6 text-left mb-6">
              <h4 className="font-semibold text-[#091626] mb-4">Récapitulatif de ton adhésion</h4>
              <div className="space-y-2 text-sm border-b border-[#E5E7EB] pb-2 mb-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Formule</span>
                  <span className="font-medium capitalize">{formData.plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="font-semibold text-green-600">{formData.plan.price} $ / mois</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prochaine échéance</span>
                  <span>{getProchaineEcheance()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Numéro membre</span>
                  <span>CM-2026-0547</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left mb-8">
              <h4 className="font-semibold text-blue-700 mb-3">📧 Prochaines étapes</h4>
              <ol className="list-decimal list-inside text-muted-foreground text-sm space-y-2 leading-relaxed">
                <li>Tu vas recevoir un email de confirmation avec tes identifiants</li>
                <li>Connecte-toi à ton espace membre pour compléter ton profil</li>
                <li>Explore les modules disponibles et commence ton parcours</li>
                <li>Rejoins le groupe WhatsApp de la communauté</li>
              </ol>
            </div>
            <Button className="bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer" asChild>
              <Link href="/membre" className="inline-flex items-center gap-2">
                Accéder à mon espace membre <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormInscriptionMembre;
