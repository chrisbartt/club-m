"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { eventsService } from "@/services/events.service";
import { ArrowLeft, ArrowRight, MessageSquare, Star } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FeedbackFormResponse } from "@/validators/events/notes/feedback-form.validator";

interface SpeakerForm {
  id: string;
  name: string;
  email?: string;
  company?: string;
  photo?: string;
}

interface SpeakerRating {
  speakerId: string;
  rating: number;
  appreciated: string;
  improvements: string;
}

const Container = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params?.id as string;
  const token = searchParams.get("token");
  const [feedbackData, setFeedbackData] = useState<FeedbackFormResponse | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  // Liste des intervenants depuis le feedback-form
  const [speakers, setSpeakers] = useState<SpeakerForm[]>([]);

  // Données du formulaire
  const [formData, setFormData] = useState({
    // Step 1
    name: "",
    phone: "",
    email: "",
    // Step 2
    organizationRating: 0,
    organizationAppreciated: "",
    organizationImprovements: "",
    // Step 3
    speakerRatings: [] as SpeakerRating[],
  });

  useEffect(() => {
    const fetchFeedbackForm = async () => {
      // Token de test pour le développement
      const TEST_TOKEN = "tgshsjf";

      // Récupérer le token depuis useSearchParams ou window.location comme fallback
      let finalToken = token;

      if (!finalToken && typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        finalToken = urlParams.get("token");
        if (finalToken) {
          console.log(
            "✅ [FEEDBACK FORM] Token récupéré depuis window.location"
          );
        }
      }

      // Utiliser le token de test si aucun token n'est trouvé (pour les tests)
      if (!finalToken) {
        finalToken = TEST_TOKEN;
        console.log(
          "🧪 [FEEDBACK FORM] Utilisation du token de test:",
          finalToken
        );
      }

      // Log pour déboguer
      const searchParamsString = searchParams.toString();
      console.log("🔍 [FEEDBACK FORM] Paramètres:", {
        eventId,
        token,
        finalToken,
        hasToken: !!finalToken,
        searchParams: searchParamsString,
        fullUrl: typeof window !== "undefined" ? window.location.href : "N/A",
      });

      if (!eventId) {
        setError("ID de l'événement manquant");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("🚀 [FEEDBACK FORM] Appel du service avec:", {
          eventId,
          finalToken,
          hasEventId: !!eventId,
          hasToken: !!finalToken,
        });

        const response = await eventsService.getFeedbackForm(
          eventId,
          finalToken
        );

        if (response.success && response.data) {
          const data = response.data.data;
          if (!data) {
            setError("Impossible de charger le formulaire");
            setLoading(false);
            return;
          }

          // Vérifier si le feedback a déjà été soumis
          if (data.already_submitted) {
            setError(
              "Vous avez déjà soumis votre évaluation pour cet événement."
            );
            setLoading(false);
            return;
          }

          setFeedbackData(response.data);

          // Récupérer le titre de l'événement pour l'affichage
          const eventResponse = await eventsService.getEventById(eventId);
          if (eventResponse.success && eventResponse.data) {
            setEventTitle(eventResponse.data.title);
          }

          // Extraire les intervenants depuis le feedback-form
          const speakersForm: SpeakerForm[] = (data.speakers ?? []).map((speaker) => ({
            id: speaker.id,
            name: speaker.name,
            email: undefined,
            company: speaker.role || undefined,
            photo: speaker.photo_url || undefined,
          }));

          setSpeakers(speakersForm);

          // Initialiser les ratings pour tous les intervenants
          const initialRatings: SpeakerRating[] = speakersForm.map(
            (speaker) => ({
              speakerId: speaker.id,
              rating: 0,
              appreciated: "",
              improvements: "",
            })
          );

          // Pré-remplir le formulaire avec les données du participant
          setFormData({
            name: data.participant?.name || "",
            phone: data.participant?.phone || "",
            email: data.participant?.email || "",
            organizationRating: 0,
            organizationAppreciated: "",
            organizationImprovements: "",
            speakerRatings: initialRatings,
          });
        } else {
          setError(response.error || "Impossible de charger le formulaire");
        }
      } catch (err) {
        console.error("Erreur lors du chargement du formulaire:", err);
        setError("Erreur lors du chargement du formulaire");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackForm();
  }, [eventId, token, searchParams]);

  // Mettre à jour la note d'un intervenant
  const updateSpeakerRating = (
    speakerId: string,
    field: "rating" | "appreciated" | "improvements",
    value: number | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      speakerRatings: prev.speakerRatings.map((rating) =>
        rating.speakerId === speakerId ? { ...rating, [field]: value } : rating
      ),
    }));
  };

  const getRatingLabel = (rating: number): string => {
    const labels: Record<number, string> = {
      1: "Très insatisfait",
      2: "Insatisfait",
      3: "Neutre",
      4: "Satisfait",
      5: "Très satisfait",
    };
    return labels[rating] || "";
  };

  const getRatingBadgeColor = (rating: number): string => {
    const colors: Record<number, string> = {
      1: "bg-red-100 text-red-700",
      2: "bg-orange-100 text-orange-700",
      3: "bg-yellow-100 text-yellow-700",
      4: "bg-green-100 text-green-700",
      5: "bg-emerald-100 text-emerald-700",
    };
    return colors[rating] || "";
  };

  const renderStars = (
    rating: number,
    onRatingChange: (rating: number) => void,
    size: "sm" | "md" | "lg" = "md"
  ) => {
    const starSize = size === "sm" ? 20 : size === "md" ? 24 : 32;
    return (
      <div className="flex items-center gap-1 justify-center flex-col">
        <div className="flex items-center gap-1 ">
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            return (
              <button
                key={index}
                type="button"
                onClick={() => onRatingChange(starValue)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={starSize}
                  className={
                    starValue <= rating
                      ? "text-yellow-500 fill-yellow-500 cursor-pointer md:!w-[48px] !w-[40px] md:!h-[48px] !h-[40px]"
                      : "text-muted-foreground opacity-40 cursor-pointer hover:text-yellow-500 md:!w-[48px] !w-[40px] md:!h-[48px] !h-[40px]"
                  }
                />
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1 flex-col justify-center">
          <span className="ml-2 text-sm md:text-base font-medium text-[#091626]">
            {rating > 0 ? `${rating}/5` : ""}
          </span>
          {rating > 0 && (
            <span className="text-xs md:text-sm text-muted-foreground">
              {getRatingLabel(rating)}
            </span>
          )}
        </div>
      </div>
    );
  };

  const nextStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Validation - Plus de validation pour l'étape 1 (informations déjà connues)
    if (currentStep === 2 && formData.organizationRating === 0) {
      alert("Veuillez noter l'organisation");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Validation finale - vérifier que tous les intervenants ont une note
    const incompleteRatings = formData.speakerRatings.some(
      (r) => r.rating === 0
    );
    if (incompleteRatings) {
      alert("Veuillez noter tous les intervenants");
      return;
    }

    setSubmitting(true);

    // TODO: Envoyer les données au backend
    // const response = await eventsService.submitFeedback(...);

    // Simulation d'un délai pour l'envoi
    setTimeout(() => {
      setSubmitting(false);
      // Ouvrir le modal de remerciement au lieu de rediriger
      setShowThankYouModal(true);
    }, 1500);
  };

  // Empêcher la soumission du formulaire avec Enter dans les textareas
  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && e.ctrlKey) {
      // Permettre Ctrl+Enter pour soumettre si nécessaire
      return;
    }
    if (e.key === "Enter") {
      // Ne rien faire, juste permettre le saut de ligne
      return;
    }
  };

  if (loading) {
    return (
      <div className="wrapper-page flex flex-col min-h-screen w-full bg-[#091626] relative z-10 py-6 md:py-10">
        <div
          className="absolute inset-0 pointer-events-none opacity-20 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>
        <div className="flex items-center justify-center min-h-[400px] my-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white opacity-70 text-base md:text-[18px]">
              Chargement...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !feedbackData) {
    return (
      <div className="wrapper-page flex flex-col min-h-screen w-full bg-[#091626] relative z-10 py-6 md:py-10">
        <div
          className="absolute inset-0 pointer-events-none opacity-20 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>
        <div className="flex items-center justify-center min-h-[400px] my-auto">
          <div className="text-center">
            <p className="text-red-400 text-base md:text-[18px]">
              {error || "Événement introuvable"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper-page flex flex-col min-h-screen w-full bg-[#091626] relative z-10 py-6 md:py-10">
      <div className="logo-club-m flex justify-center items-center">
        <Image
          src="/logos/logo1.png"
          alt="logo club m"
          className="md:w-[80px!important] w-[60px!important] h-auto"
          width={80}
          height={80}
          layout="responsive"
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none opacity-20 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>
      <div className="container mx-auto px-4 lg:px-0 mt-4 pb-8 space-y-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 hidden md:block"></div>
          <div className="col-span-12 lg:col-span-6">
            <div className="mt-4 md:mt-0 md:text-center mb-6">
              <h2 className="md:text-3xl text-2xl font-medium text-[#ffffff] mb-2">
                Formulaire d&apos;évaluation
              </h2>
              {eventTitle && (
                <p className="text-white opacity-70 text-base md:text-[18px]">
                  {eventTitle}
                </p>
              )}
            </div>
            {/* Stepper */}
            <div className="relative mb-10 lg:mb-14 w-full px-4">
              <div className="content-step flex relative z-10 w-full items-center justify-between">
                <div className="line absolute left-0 h-[2px] w-full bg-[#3a4451] -z-10 rounded-full"></div>
                <div
                  className="line absolute left-0 h-[2px] bg-[#a55b46] -z-10 rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    width: `${((currentStep - 1) / 2) * 100}%`,
                  }}
                ></div>
                {[
                  { number: 1, label: "Informations" },
                  { number: 2, label: "Organisation" },
                  { number: 3, label: "Intervenants" },
                ].map((step) => {
                  const isActive = step.number <= currentStep;
                  return (
                    <div
                      key={step.number}
                      className="item-step flex flex-col items-center justify-center"
                    >
                      <div
                        className={`num rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors duration-300 ${
                          isActive
                            ? "bg-[#a55b46] text-white"
                            : "bg-[#3a4451] text-white"
                        }`}
                      >
                        {step.number}
                      </div>
                      <div
                        className={`text-xs absolute top-[130%] whitespace-nowrap text-center hidden md:block transition-colors duration-300 ${
                          isActive ? "text-white" : "text-[#a6aeb9]"
                        }`}
                      >
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg p-4 md:p-6">
                {/* Step 1: Message de bienvenue */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center py-8 md:py-12">
                      <h3 className="md:text-2xl text-xl font-medium text-[#091626] mb-6">
                        Merci pour votre participation !
                      </h3>
                      <div className="space-y-4 text-[#091626]">
                        <p className="md:text-lg text-base">
                          Salut{" "}
                          <span className="font-semibold">
                            {feedbackData?.data?.participant?.name || ""}
                          </span>
                          ,
                        </p>
                        <p className="md:text-base text-sm leading-relaxed">
                          Nous sommes ravis que vous ayez participé à notre
                          événement{" "}
                          <span className="font-medium">
                            {eventTitle || ""}
                          </span>
                          .
                        </p>
                        <p className="md:text-base text-sm leading-relaxed">
                          Votre avis est très important pour nous ! Nous vous
                          serions reconnaissants de prendre{" "}
                          <span className="font-medium">deux minutes</span> pour
                          remplir ce formulaire d&apos;évaluation. Cela nous
                          aidera à améliorer nos futurs événements.
                        </p>
                        <p className="md:text-base text-sm leading-relaxed mt-6 text-[#091626] opacity-80">
                          Vous n&apos;aurez qu&apos;à évaluer
                          l&apos;organisation et les intervenants. Vos
                          informations personnelles sont déjà enregistrées.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Organisation */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="md:text-2xl text-xl font-medium text-[#091626] mb-4">
                        Évaluation de l&apos;organisation
                      </h3>

                      <div className="space-y-6">
                        {/* Note */}
                        <div>
                          <label className="block text-sm font-medium text-[#091626] mb-4 text-center lg:mt-8 mt-6">
                            Sélectionnez une note de 1 à 5 étoiles
                          </label>
                          {/* <p className="text-xs text-muted-foreground mb-3">
                            Sélectionnez une note de 1 à 5 étoiles (1 = Très
                            insatisfait, 5 = Très satisfait)
                          </p> */}
                          {renderStars(formData.organizationRating, (rating) =>
                            setFormData((prev) => ({
                              ...prev,
                              organizationRating: rating,
                            }))
                          )}
                        </div>

                        {formData.organizationRating > 0 && (
                          <>
                            {/* Qu'est-ce qui t'a apprécié */}
                            <div>
                              <label
                                htmlFor="organizationAppreciated"
                                className="block text-sm font-medium text-[#091626] mb-2"
                              >
                                Points forts de l&apos;organisation (optionnel)
                              </label>

                              <Textarea
                                id="organizationAppreciated"
                                name="organizationAppreciated"
                                value={formData.organizationAppreciated}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    organizationAppreciated: e.target.value,
                                  }))
                                }
                                onKeyDown={handleTextareaKeyDown}
                                placeholder="Votre commentaire..."
                                rows={4}
                                className="shadow-none resize-none md:text-base text-sm focus-visible:ring-0 focus-visible:border-[#091626] rounded-lg"
                              />
                            </div>

                            {/* Qu'est-ce qu'on peut améliorer */}
                            <div>
                              <label
                                htmlFor="organizationImprovements"
                                className="block text-sm font-medium text-[#091626] mb-2"
                              >
                                Axes d&apos;amélioration (optionnel)
                              </label>

                              <Textarea
                                id="organizationImprovements"
                                name="organizationImprovements"
                                value={formData.organizationImprovements}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    organizationImprovements: e.target.value,
                                  }))
                                }
                                onKeyDown={handleTextareaKeyDown}
                                placeholder="Votre commentaire..."
                                rows={4}
                                className="shadow-none resize-none md:text-base text-sm focus-visible:ring-0 focus-visible:border-[#091626] rounded-lg"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Intervenants */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-medium text-[#091626] mb-2">
                        Évaluation des intervenants
                      </h3>
                      <p className="text-sm md:text-base text-[#091626] opacity-70 mb-3">
                        Veuillez évaluer les interventions des intervenants.
                      </p>

                      {/* Évaluations des intervenants */}
                      <div>
                        <Accordion type="single" collapsible className="w-full">
                          {speakers.map((speaker) => {
                            const rating = formData.speakerRatings.find(
                              (r) => r.speakerId === speaker.id
                            );
                            if (!rating) return null;

                            return (
                              <AccordionItem
                                key={speaker.id}
                                value={speaker.id}
                                className="border-b border-gray-200"
                              >
                                <AccordionTrigger className="font-medium text-[#091626] hover:no-underline cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="md:w-14 w-10 md:h-14 h-10 flex-shrink-0">
                                      <AvatarImage
                                        src={speaker.photo}
                                        className="object-cover"
                                      />
                                      <AvatarFallback>
                                        {speaker.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="flex items-center gap-2 w-full">
                                        <h6 className="md:text-base text-sm font-medium text-[#091626]">
                                          {speaker.name}
                                        </h6>
                                        {rating.rating > 0 && (
                                          <span
                                            className={`md:text-xs text-[10px] flex items-center justify-center text-center px-2 py-1 rounded-full font-medium ${getRatingBadgeColor(
                                              rating.rating
                                            )}`}
                                          >
                                            {getRatingLabel(rating.rating)}
                                          </span>
                                        )}
                                      </div>
                                      {speaker.company && (
                                        <span className="md:text-sm text-xs block text-start text-[#091626] opacity-50 font-normal mt-1">
                                          {speaker.company}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                  {/* Note */}
                                  <div>
                                    <label className="block text-sm font-medium text-[#091626] mb-3 text-center">
                                      Sélectionnez une note de 1 à 5 étoiles
                                    </label>

                                    {renderStars(rating.rating, (newRating) =>
                                      updateSpeakerRating(
                                        speaker.id,
                                        "rating",
                                        newRating
                                      )
                                    )}
                                  </div>

                                  {/* Qu'est-ce qui t'a apprécié */}
                                  {rating.rating > 0 && (
                                    <>
                                      <div>
                                        <label
                                          htmlFor={`appreciated-${speaker.id}`}
                                          className="block text-sm font-medium text-[#091626] mb-2"
                                        >
                                          Points forts de l&apos;intervention
                                          (optionnel)
                                        </label>

                                        <Textarea
                                          id={`appreciated-${speaker.id}`}
                                          value={rating.appreciated}
                                          onChange={(e) =>
                                            updateSpeakerRating(
                                              speaker.id,
                                              "appreciated",
                                              e.target.value
                                            )
                                          }
                                          onKeyDown={handleTextareaKeyDown}
                                          placeholder="Votre commentaire..."
                                          rows={4}
                                          className="shadow-none resize-none md:text-base text-sm focus-visible:ring-0 focus-visible:border-[#091626] rounded-lg"
                                        />
                                      </div>

                                      {/* Qu'est-ce qu'on peut améliorer */}
                                      <div>
                                        <label
                                          htmlFor={`improvements-${speaker.id}`}
                                          className="block text-sm font-medium text-[#091626] mb-2"
                                        >
                                          Axes d&apos;amélioration (optionnel)
                                        </label>

                                        <Textarea
                                          id={`improvements-${speaker.id}`}
                                          value={rating.improvements}
                                          onChange={(e) =>
                                            updateSpeakerRating(
                                              speaker.id,
                                              "improvements",
                                              e.target.value
                                            )
                                          }
                                          onKeyDown={handleTextareaKeyDown}
                                          placeholder="Votre commentaire..."
                                          rows={4}
                                          className="shadow-none resize-none md:text-base text-sm focus-visible:ring-0 focus-visible:border-[#091626] rounded-lg"
                                        />
                                      </div>
                                    </>
                                  )}
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      </div>
                    </div>
                  </div>
                )}
                {/* Boutons de navigation */}
                {currentStep === 1 ? (
                  <div className="flex mt-6 lg:mt-8 justify-center">
                    <Button
                      type="button"
                      size="lg"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        nextStep(e);
                      }}
                      className="gap-2 px-8 md:h-12 h-10 rounded-lg bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer shadow-none"
                    >
                      Commencer
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex mt-6 lg:mt-8 justify-between">
                    <Button
                      type="button"
                      size="lg"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        prevStep(e);
                      }}
                      className="gap-2 w-[49%] md:h-12 h-10 rounded-lg bg-[#f5f5f5] hover:bg-[#f5f5f5]/90 text-[#091626] hover:text-[#091626] cursor-pointer shadow-none"
                    >
                      <ArrowLeft size={16} />
                      Précédent
                    </Button>
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        size="lg"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          nextStep(e);
                        }}
                        className="gap-2 w-[49%] md:h-12 h-10 rounded-lg bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer shadow-none"
                      >
                        Suivant
                        <ArrowRight size={16} />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        size="lg"
                        disabled={submitting}
                        className="gap-2 w-[49%] md:h-12 h-10 rounded-lg bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer shadow-none"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Envoi en cours...</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare size={16} />
                            Envoyer
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
          <div className="col-span-3 hidden md:block"></div>
        </div>
      </div>

      {/* Modal de remerciement */}
      <Dialog open={showThankYouModal} onOpenChange={setShowThankYouModal}>
        <DialogContent className="sm:max-w-md w-full border-0 bg-white rounded-[24px] p-6 md:p-8">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#a55b46]/10">
              <MessageSquare className="h-8 w-8 text-[#a55b46]" />
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-medium text-[#091626] mb-2">
              Merci pour votre évaluation !
            </DialogTitle>
            <DialogDescription className="text-base md:text-lg text-[#091626] opacity-80 mt-4">
              <p className="mb-2">
                Merci{" "}
                <span className="font-semibold">
                  {feedbackData?.data?.participant?.name || ""}
                </span>{" "}
                d&apos;avoir pris le temps de remplir ce formulaire.
              </p>
              <p>
                Votre avis est précieux et nous aidera à améliorer nos futurs
                événements.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => setShowThankYouModal(false)}
              className="gap-2 px-8 md:h-12 h-10 rounded-lg bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer shadow-none"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Container;
