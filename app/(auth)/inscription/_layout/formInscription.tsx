"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Eye,
  EyeOff,
  FileText,
  ImageIcon,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Upload,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type StepIdentite = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  password: string;
  passwordConfirm: string;
};

type StepDocument = {
  selfie: File | null;
  selfiePreview: string | null;
  typeDocument: string;
  pieceIdentite: File | null;
  pieceIdentitePreview: string | null;
};

// ─── Password strength ──────────────────────────────────────────────────────

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Faible", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Moyen", color: "bg-orange-500" };
  if (score <= 3) return { score, label: "Bon", color: "bg-yellow-500" };
  return { score, label: "Fort", color: "bg-green-500" };
}

// ─── Step progress ───────────────────────────────────────────────────────────

function StepProgress({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: "Identite" },
    { number: 2, label: "Document" },
  ];

  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {steps.map((step, i) => (
        <div key={step.number} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                currentStep > step.number
                  ? "bg-white text-[#a55b46]"
                  : currentStep === step.number
                    ? "bg-white text-[#a55b46]"
                    : "bg-white/20 text-white/60"
              }`}
            >
              {currentStep > step.number ? (
                <Check size={16} />
              ) : (
                step.number
              )}
            </div>
            <span
              className={`text-sm font-medium hidden sm:inline transition-colors duration-300 ${
                currentStep >= step.number
                  ? "text-white"
                  : "text-white/50"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-12 h-[2px] rounded-full transition-colors duration-300 ${
                currentStep > step.number ? "bg-white" : "bg-white/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── File drop zone ──────────────────────────────────────────────────────────

function FileDropZone({
  label,
  description,
  accept,
  icon: Icon,
  file,
  preview,
  onFileSelect,
  onRemove,
}: {
  label: string;
  description: string;
  accept: string;
  icon: React.ElementType;
  file: File | null;
  preview: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFileSelect(dropped);
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) onFileSelect(selected);
    },
    [onFileSelect]
  );

  if (file && preview) {
    const isImage = file.type.startsWith("image/");
    return (
      <div className="relative rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10"
        >
          <X size={14} />
        </button>
        <div className="flex items-center gap-4">
          {isImage ? (
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
              <Image
                src={preview}
                alt={label}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <FileText size={32} className="text-gray-400" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-gray-800 text-sm font-medium truncate">
              {file.name}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} Mo
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? "border-[#a55b46] bg-[#a55b46]/5"
          : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-[#a55b46]/10 flex items-center justify-center">
          <Icon size={24} className="text-[#a55b46]" />
        </div>
        <p className="text-gray-700 font-medium text-sm">{label}</p>
        <p className="text-gray-400 text-xs">{description}</p>
        <div className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
          <Upload size={12} />
          <span>Glisser-deposer ou cliquer</span>
        </div>
      </div>
    </div>
  );
}

// ─── Camera capture ─────────────────────────────────────────────────────────

function CameraCapture({
  file,
  preview,
  onCapture,
  onRemove,
}: {
  file: File | null;
  preview: string | null;
  onCapture: (file: File) => void;
  onRemove: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  }, []);

  // Assign stream to video element once it renders
  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch {
      setCameraError("Impossible d'acceder a la camera. Verifie les permissions.");
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror the image horizontally (front camera)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `selfie-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCapture(file);
        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  // Photo taken — show preview
  if (file && preview) {
    return (
      <div className="relative rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10"
        >
          <X size={14} />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
            <Image
              src={preview}
              alt="Selfie"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <p className="text-gray-800 text-sm font-medium">Selfie capture</p>
            <p className="text-gray-400 text-xs mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} Mo
            </p>
            <button
              type="button"
              onClick={() => {
                onRemove();
                setTimeout(startCamera, 100);
              }}
              className="flex items-center gap-1 text-[#a55b46] text-xs mt-2 hover:underline"
            >
              <RefreshCw size={12} />
              Reprendre
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Camera open — show live feed
  if (isCameraOpen) {
    return (
      <div className="rounded-xl border-2 border-[#a55b46] bg-black overflow-hidden">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-[4/3] object-cover scale-x-[-1]"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="flex items-center justify-center gap-3 p-3 bg-gray-900">
          <button
            type="button"
            onClick={stopCamera}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={takePhoto}
            className="w-14 h-14 rounded-full bg-white border-4 border-[#a55b46] flex items-center justify-center hover:scale-105 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-[#a55b46]" />
          </button>
          <div className="w-[72px]" />
        </div>
      </div>
    );
  }

  // Default — button to open camera
  return (
    <div>
      <button
        type="button"
        onClick={startCamera}
        className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 p-6 text-center cursor-pointer transition-all duration-200"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#a55b46]/10 flex items-center justify-center">
            <Camera size={24} className="text-[#a55b46]" />
          </div>
          <p className="text-gray-700 font-medium text-sm">Prendre un selfie</p>
          <p className="text-gray-400 text-xs">
            Ouvre ta camera pour capturer une photo
          </p>
        </div>
      </button>
      {cameraError && (
        <p className="text-red-500 text-xs mt-2">{cameraError}</p>
      )}
    </div>
  );
}

// ─── Main form ───────────────────────────────────────────────────────────────

const PLANS: Record<string, { label: string; price: string }> = {
  free: { label: "Free", price: "0 $" },
  premium: { label: "Premium", price: "90 $ / 3 mois" },
  business: { label: "Business", price: "180 $ / 6 mois" },
};

export default function FormInscription() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan") || "";
  const selectedPlan = PLANS[planKey] || null;

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFemme, setIsFemme] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1
  const [identite, setIdentite] = useState<StepIdentite>({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    password: "",
    passwordConfirm: "",
  });

  // Step 2
  const [document, setDocument] = useState<StepDocument>({
    selfie: null,
    selfiePreview: null,
    typeDocument: "",
    pieceIdentite: null,
    pieceIdentitePreview: null,
  });

  const passwordStrength = useMemo(
    () => getPasswordStrength(identite.password),
    [identite.password]
  );

  // ─── Handlers ────────────────────────────────────────────────────────

  const handleIdentiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIdentite((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSelfieSelect = useCallback((file: File) => {
    const preview = URL.createObjectURL(file);
    setDocument((prev) => ({
      ...prev,
      selfie: file,
      selfiePreview: preview,
    }));
    if (errors.selfie) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.selfie;
        return next;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors.selfie]);

  const handlePieceSelect = useCallback((file: File) => {
    const isImage = file.type.startsWith("image/");
    const preview = isImage ? URL.createObjectURL(file) : file.name;
    setDocument((prev) => ({
      ...prev,
      pieceIdentite: file,
      pieceIdentitePreview: preview,
    }));
    if (errors.pieceIdentite) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.pieceIdentite;
        return next;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors.pieceIdentite]);

  // ─── Validation ──────────────────────────────────────────────────────

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!identite.prenom.trim()) newErrors.prenom = "Le prenom est requis";
    if (!identite.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!identite.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identite.email)) {
      newErrors.email = "Email invalide";
    }
    if (!identite.telephone.trim()) {
      newErrors.telephone = "Le telephone est requis";
    }
    if (!identite.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (identite.password.length < 8) {
      newErrors.password = "Minimum 8 caracteres";
    }
    if (identite.password !== identite.passwordConfirm) {
      newErrors.passwordConfirm = "Les mots de passe ne correspondent pas";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!document.selfie) newErrors.selfie = "La photo selfie est requise";
    if (!document.typeDocument)
      newErrors.typeDocument = "Le type de document est requis";
    if (!document.pieceIdentite)
      newErrors.pieceIdentite = "La piece d'identite est requise";
    if (!isFemme)
      newErrors.isFemme = "Tu dois confirmer que tu es une femme pour rejoindre le Club M";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Navigation ──────────────────────────────────────────────────────

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setIsSubmitting(true);
    setErrors({});

    try {
      // Step 1: Register user
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: identite.prenom,
          nom: identite.nom,
          email: identite.email,
          telephone: identite.telephone,
          password: identite.password,
          plan: planKey || "free",
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        if (registerData.details) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, messages] of Object.entries(registerData.details)) {
            fieldErrors[key] = (messages as string[])[0];
          }
          setErrors(fieldErrors);
          setCurrentStep(1);
        } else {
          setErrors({ global: registerData.error || "Erreur lors de l'inscription" });
        }
        setIsSubmitting(false);
        return;
      }

      const { userId } = registerData;

      // Step 2: Upload identity documents
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("documentType", document.typeDocument);
      formData.append("selfie", document.selfie!);
      formData.append("document", document.pieceIdentite!);

      const uploadRes = await fetch("/api/identity/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setErrors({ global: uploadData.error || "Erreur lors de l'envoi des documents" });
        setIsSubmitting(false);
        return;
      }

      // Auto-login and redirect to dashboard
      const loginRes = await signIn("credentials", {
        email: identite.email,
        password: identite.password,
        redirect: false,
      });

      if (loginRes?.ok) {
        router.push("/membre");
      } else {
        // Registration succeeded but auto-login failed — redirect to login
        router.push("/login");
      }
    } catch {
      setErrors({ global: "Une erreur est survenue. Veuillez reessayer." });
      setIsSubmitting(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Video background */}
      <video
        src="/videos/2.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-20"
      />
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/40 -z-10" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <Link href="/" className="flex items-center">
          <Image
            src="/logos/logo1.png"
            alt="Club M"
            width={50}
            height={50}
            className="w-[50px] h-auto"
          />
        </Link>
        <Link
          href="/login"
          className="text-white/80 text-sm hover:text-white transition-colors"
        >
          Connexion
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4 pb-8">
        <div className="w-full max-w-[480px]">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl lg:text-3xl font-semibold text-white mb-2">
              Rejoins le Club M
            </h1>
            {selectedPlan ? (
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mt-1">
                <span className="text-white text-sm font-medium">
                  Plan {selectedPlan.label}
                </span>
                <span className="text-white/60 text-sm">
                  — {selectedPlan.price}
                </span>
              </div>
            ) : (
              <p className="text-white/70 text-sm">
                La communaute des femmes entrepreneures
              </p>
            )}
          </div>

          {/* Steps */}
          <StepProgress currentStep={currentStep} />

          {/* Form card */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
            {/* Global error */}
            {errors.global && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <p className="text-red-600 text-sm">{errors.global}</p>
              </div>
            )}

            {/* ── Step 1: Identite ───────────────────────────────── */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#091626] mb-1">
                  Tes informations
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Ces informations nous permettent de creer ton compte.
                </p>

                {/* Prenom / Nom */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Prenom
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        name="prenom"
                        value={identite.prenom}
                        onChange={handleIdentiteChange}
                        placeholder="Ex: Gracia"
                        className="pl-9 h-11 rounded-xl border-gray-200 focus-visible:border-[#a55b46] focus-visible:ring-[#a55b46]/20"
                      />
                    </div>
                    {errors.prenom && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.prenom}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nom
                    </label>
                    <Input
                      name="nom"
                      value={identite.nom}
                      onChange={handleIdentiteChange}
                      placeholder="Ex: Morel"
                      className="h-11 rounded-xl border-gray-200 focus-visible:border-[#a55b46] focus-visible:ring-[#a55b46]/20"
                    />
                    {errors.nom && (
                      <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      name="email"
                      type="email"
                      value={identite.email}
                      onChange={handleIdentiteChange}
                      placeholder="gracia@example.com"
                      className="pl-9 h-11 rounded-xl border-gray-200 focus-visible:border-[#a55b46] focus-visible:ring-[#a55b46]/20"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Telephone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Telephone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      name="telephone"
                      type="tel"
                      value={identite.telephone}
                      onChange={handleIdentiteChange}
                      placeholder="+243 XXX XXX XXX"
                      className="pl-9 h-11 rounded-xl border-gray-200 focus-visible:border-[#a55b46] focus-visible:ring-[#a55b46]/20"
                    />
                  </div>
                  {errors.telephone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.telephone}
                    </p>
                  )}
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={identite.password}
                      onChange={handleIdentiteChange}
                      placeholder="Min. 8 caracteres"
                      className="h-11 pr-10 rounded-xl border-gray-200 focus-visible:border-[#a55b46] focus-visible:ring-[#a55b46]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {identite.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              level <= passwordStrength.score
                                ? passwordStrength.color
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs ${
                          passwordStrength.score <= 1
                            ? "text-red-500"
                            : passwordStrength.score <= 2
                              ? "text-orange-500"
                              : passwordStrength.score <= 3
                                ? "text-yellow-600"
                                : "text-green-600"
                        }`}
                      >
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirmation mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      name="passwordConfirm"
                      type={showPasswordConfirm ? "text" : "password"}
                      value={identite.passwordConfirm}
                      onChange={handleIdentiteChange}
                      placeholder="Retaper le mot de passe"
                      className="h-11 pr-10 rounded-xl border-gray-200 focus-visible:border-[#a55b46] focus-visible:ring-[#a55b46]/20"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordConfirm(!showPasswordConfirm)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswordConfirm ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {errors.passwordConfirm && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.passwordConfirm}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full h-12 rounded-xl bg-[#a55b46] hover:bg-[#8a4a3a] text-white font-medium text-base cursor-pointer mt-2"
                >
                  Continuer
                  <ArrowRight size={18} className="ml-1" />
                </Button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  Tu as deja un compte ?{" "}
                  <Link
                    href="/login"
                    className="text-[#a55b46] font-medium hover:underline"
                  >
                    Connecte-toi
                  </Link>
                </p>
              </div>
            )}

            {/* ── Step 2: Documents ──────────────────────────────── */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#091626] mb-1">
                    Verification d&apos;identite
                  </h2>
                  <p className="text-sm text-gray-500">
                    Club M est reserve aux femmes entrepreneures. Ces documents
                    nous permettent de verifier ton identite.
                  </p>
                </div>

                {/* Selfie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo selfie
                  </label>
                  <CameraCapture
                    file={document.selfie}
                    preview={document.selfiePreview}
                    onCapture={handleSelfieSelect}
                    onRemove={() =>
                      setDocument((prev) => ({
                        ...prev,
                        selfie: null,
                        selfiePreview: null,
                      }))
                    }
                  />
                  {errors.selfie && (
                    <p className="text-red-500 text-xs mt-1">{errors.selfie}</p>
                  )}
                </div>

                {/* Type de document */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de piece d&apos;identite
                  </label>
                  <Select
                    value={document.typeDocument}
                    onValueChange={(value) => {
                      setDocument((prev) => ({
                        ...prev,
                        typeDocument: value,
                      }));
                      if (errors.typeDocument) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.typeDocument;
                          return next;
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 focus-visible:border-[#a55b46] focus-visible:ring-[#a55b46]/20">
                      <SelectValue placeholder="Choisir le type de document" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passeport">Passeport</SelectItem>
                      <SelectItem value="carte-electeur">
                        Carte d&apos;electeur
                      </SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.typeDocument && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.typeDocument}
                    </p>
                  )}
                </div>

                {/* Piece d'identite */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Piece d&apos;identite
                  </label>
                  <FileDropZone
                    label="Ajouter ta piece d'identite"
                    description="Image ou PDF du document (JPG, PNG, PDF - max 5 Mo)"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    icon={ImageIcon}
                    file={document.pieceIdentite}
                    preview={document.pieceIdentitePreview}
                    onFileSelect={handlePieceSelect}
                    onRemove={() =>
                      setDocument((prev) => ({
                        ...prev,
                        pieceIdentite: null,
                        pieceIdentitePreview: null,
                      }))
                    }
                  />
                  {errors.pieceIdentite && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.pieceIdentite}
                    </p>
                  )}
                </div>

                {/* Checkbox femme */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFemme}
                      onChange={(e) => {
                        setIsFemme(e.target.checked);
                        if (errors.isFemme) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.isFemme;
                            return next;
                          });
                        }
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#a55b46] accent-[#a55b46] cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 leading-snug">
                      Je confirme que je suis une femme. Club M est une communaute
                      exclusivement feminine.
                    </span>
                  </label>
                  {errors.isFemme && (
                    <p className="text-red-500 text-xs mt-1.5 ml-7">
                      {errors.isFemme}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 h-12 rounded-xl border-gray-200 text-gray-700 font-medium cursor-pointer"
                  >
                    <ArrowLeft size={18} className="mr-1" />
                    Retour
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-[2] h-12 rounded-xl bg-[#a55b46] hover:bg-[#8a4a3a] text-white font-medium text-base cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="mr-1 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Soumettre mon inscription
                        <ArrowRight size={18} className="ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-white/50 text-xs mt-6">
            En t&apos;inscrivant, tu acceptes nos{" "}
            <Link href="/mentions-legales" className="underline hover:text-white/70">
              conditions d&apos;utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/mentions-legales#donnees" className="underline hover:text-white/70">
              politique de confidentialite
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
