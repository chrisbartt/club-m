"use client";

import AppContainer from "@/components/common/containers/AppContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    ArrowRight,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Plus,
    Trash2,
    X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EventSteps from "./event-steps";

const EVENT_TYPES = [
    "Ateliers",
    "Lunchs",
    "Conférences",
    "Formations",
    "Networking",
    "Autre",
];

interface Host {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

interface Ticket {
    id: string;
    name: string;
    price: string;
    quantity: string;
    description: string;
    is_active: boolean;
}

const Container = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "",
        date: "",
        time: "",
        location: "",
        coverImagePreview: "",
        is_public: true,
    });
    const [hosts, setHosts] = useState<Host[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name === "date" && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () =>
                setFormData((prev) => ({
                    ...prev,
                    coverImagePreview: reader.result as string,
                }));
            reader.readAsDataURL(file);
        }
    };

    const addHost = () => {
        setHosts([
            ...hosts,
            { id: Date.now().toString(), name: "", email: "" },
        ]);
    };
    const updateHost = (id: string, field: keyof Host, value: string) => {
        setHosts(
            hosts.map((h) => (h.id === id ? { ...h, [field]: value } : h))
        );
    };
    const removeHost = (id: string) => setHosts(hosts.filter((h) => h.id !== id));

    const addTicket = () => {
        setTickets([
            ...tickets,
            {
                id: Date.now().toString(),
                name: "",
                price: "",
                quantity: "",
                description: "",
                is_active: true,
            },
        ]);
    };
    const updateTicket = (
        id: string,
        field: keyof Ticket,
        value: string | boolean
    ) => {
        setTickets(
            tickets.map((t) => (t.id === id ? { ...t, [field]: value } : t))
        );
    };
    const removeTicket = (id: string) =>
        setTickets(tickets.filter((t) => t.id !== id));

    const totalPlaces = () =>
        tickets.reduce((acc, t) => acc + (parseInt(t.quantity) || 0), 0);

    const isStepValid = (): boolean => {
        switch (currentStep) {
            case 1:
                return !!formData.type;
            case 2:
                return !!(
                    formData.title &&
                    formData.description &&
                    formData.date &&
                    formData.time &&
                    formData.location
                );
            case 3:
                return (
                    hosts.length > 0 &&
                    hosts.every((h) => h.name.trim() && h.email.trim())
                );
            case 4:
                if (tickets.length === 0) return true;
                return tickets.every(
                    (t) =>
                        t.name.trim() &&
                        t.price !== "" &&
                        parseFloat(t.price) >= 0 &&
                        t.quantity !== "" &&
                        parseInt(t.quantity) > 0
                );
            case 5:
                return !!(
                    formData.type &&
                    formData.title &&
                    formData.description &&
                    formData.date &&
                    formData.time &&
                    formData.location &&
                    hosts.length > 0 &&
                    hosts.every((h) => h.name.trim() && h.email.trim())
                );
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (currentStep === 1 && !formData.type) return;
        if (
            currentStep === 2 &&
            (!formData.title ||
                !formData.description ||
                !formData.date ||
                !formData.time ||
                !formData.location)
        )
            return;
        if (currentStep === 3 && hosts.length === 0) return;
        if (currentStep < 5) setCurrentStep((s) => s + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep((s) => s - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep !== 5 || !isStepValid()) return;
        // Pas d'appel API : redirection vers la liste
        router.push("/admin/evenements");
    };

    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 grow">
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6 max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            asChild
                            className="mb-4 gap-2 text-colorMuted hover:text-colorTitle"
                        >
                            <Link href="/admin/evenements">
                                <ArrowLeft size={16} />
                                Retour à la liste
                            </Link>
                        </Button>
                        <h1 className="text-[24px] font-bold text-colorTitle mb-1">
                            Créer un nouvel événement
                        </h1>
                        <p className="text-[14px] text-colorMuted">
                            Remplissez les étapes ci-dessous pour créer un
                            événement.
                        </p>
                    </div>

                    <EventSteps currentStep={currentStep} />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Step 1: Type */}
                        {currentStep === 1 && (
                            <Card className="bg-bgCard border-colorBorder shadow-sm">
                                <CardHeader>
                                    <h2 className="text-[16px] font-semibold text-colorTitle">
                                        Sélectionnez le type d&apos;événement
                                    </h2>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {EVENT_TYPES.map((type) => (
                                            <Button
                                                key={type}
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        type,
                                                    }))
                                                }
                                                className={`h-auto py-4 rounded-lg border-2 transition-all ${formData.type === type
                                                    ? "border-primaryColor bg-primaryColor/10 text-primaryColor"
                                                    : "border-colorBorder hover:border-colorMuted"
                                                    }`}
                                            >
                                                {type}
                                            </Button>
                                        ))}
                                    </div>
                                    {formData.type && (
                                        <p className="mt-4 text-[13px] text-colorMuted">
                                            Type sélectionné :{" "}
                                            <strong className="text-colorTitle">
                                                {formData.type}
                                            </strong>
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 2: Informations */}
                        {currentStep === 2 && (
                            <>
                                <Card className="bg-bgCard border-colorBorder shadow-sm">
                                    <CardHeader>
                                        <h2 className="text-[16px] font-semibold text-colorTitle">
                                            Informations de base
                                        </h2>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="block text-[13px] font-medium text-colorTitle mb-1.5">
                                                Titre <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                placeholder="Ex: Business Women Lunch"
                                                className="h-10 border-colorBorder"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-medium text-colorTitle mb-1.5">
                                                Description <span className="text-red-500">*</span>
                                            </label>
                                            <Textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                placeholder="Décrivez l'événement..."
                                                rows={4}
                                                className="resize-none border-colorBorder"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[13px] font-medium text-colorTitle mb-1.5">
                                                    Date <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-colorMuted" />
                                                    <Input
                                                        type="date"
                                                        name="date"
                                                        value={formData.date}
                                                        onChange={handleInputChange}
                                                        min={new Date().toISOString().split("T")[0]}
                                                        className="h-10 pl-9 border-colorBorder"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-medium text-colorTitle mb-1.5">
                                                    Heure <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-colorMuted" />
                                                    <Input
                                                        type="time"
                                                        name="time"
                                                        value={formData.time}
                                                        onChange={handleInputChange}
                                                        className="h-10 pl-9 border-colorBorder"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-medium text-colorTitle mb-1.5">
                                                Lieu <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-colorMuted" />
                                                <Input
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    placeholder="Ex: La Maison Hobah"
                                                    className="h-10 pl-9 border-colorBorder"
                                                />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_public}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        is_public: e.target.checked,
                                                    }))
                                                }
                                                className="rounded border-colorBorder"
                                            />
                                            <span className="text-[13px] text-colorTitle">
                                                Événement public
                                            </span>
                                        </label>
                                    </CardContent>
                                </Card>
                                <Card className="bg-bgCard border-colorBorder shadow-sm">
                                    <CardHeader>
                                        <h2 className="text-[16px] font-semibold text-colorTitle">
                                            Image de couverture
                                        </h2>
                                    </CardHeader>
                                    <CardContent>
                                        {formData.coverImagePreview ? (
                                            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-bgGray">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={formData.coverImagePreview}
                                                    alt="Aperçu"
                                                    className="w-full h-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            coverImagePreview: "",
                                                        }))
                                                    }
                                                >
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-colorBorder rounded-lg cursor-pointer hover:bg-bgGray transition-colors">
                                                <Plus className="size-8 text-colorMuted mb-2" />
                                                <span className="text-[13px] text-colorMuted">
                                                    Cliquez pour ajouter une image
                                                </span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        )}
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Step 3: Participants (hôtes uniquement pour simplifier) */}
                        {currentStep === 3 && (
                            <Card className="bg-bgCard border-colorBorder shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <h2 className="text-[16px] font-semibold text-colorTitle">
                                        Hôtes <span className="text-red-500">*</span>
                                    </h2>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addHost}
                                        className="gap-2"
                                    >
                                        <Plus size={16} />
                                        Ajouter un hôte
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {hosts.length === 0 ? (
                                        <p className="text-[13px] text-colorMuted text-center py-6">
                                            Aucun hôte. Cliquez sur &quot;Ajouter un hôte&quot;.
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            {hosts.map((host) => (
                                                <div
                                                    key={host.id}
                                                    className="flex flex-col gap-3 rounded-xl border border-colorBorder p-4 bg-bgGray/30"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[13px] font-medium text-colorTitle">
                                                            Hôte #{hosts.indexOf(host) + 1}
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeHost(host.id)}
                                                            className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <Input
                                                            placeholder="Nom complet"
                                                            value={host.name}
                                                            onChange={(e) =>
                                                                updateHost(host.id, "name", e.target.value)
                                                            }
                                                            className="border-colorBorder"
                                                        />
                                                        <Input
                                                            type="email"
                                                            placeholder="email@example.com"
                                                            value={host.email}
                                                            onChange={(e) =>
                                                                updateHost(host.id, "email", e.target.value)
                                                            }
                                                            className="border-colorBorder"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 4: Catégories de prix */}
                        {currentStep === 4 && (
                            <Card className="bg-bgCard border-colorBorder shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <h2 className="text-[16px] font-semibold text-colorTitle">
                                            Catégories de prix (optionnel)
                                        </h2>
                                        <p className="text-[13px] text-colorMuted mt-1">
                                            Ajoutez des billets pour votre événement.
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addTicket}
                                        className="gap-2"
                                    >
                                        <Plus size={16} />
                                        Ajouter un ticket
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {tickets.length > 0 && (
                                        <p className="text-[13px] text-colorMuted mb-4">
                                            Total places : <strong>{totalPlaces()}</strong>
                                        </p>
                                    )}
                                    {tickets.length === 0 ? (
                                        <p className="text-[13px] text-colorMuted text-center py-6">
                                            Aucun ticket. Optionnel.
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            {tickets.map((ticket) => (
                                                <div
                                                    key={ticket.id}
                                                    className="rounded-xl border border-colorBorder p-4 space-y-3 bg-bgGray/30"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[13px] font-medium text-colorTitle">
                                                            Ticket #{tickets.indexOf(ticket) + 1}
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeTicket(ticket.id)}
                                                            className="text-red-500 hover:bg-red-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <Input
                                                            placeholder="Nom (ex: Standard)"
                                                            value={ticket.name}
                                                            onChange={(e) =>
                                                                updateTicket(ticket.id, "name", e.target.value)
                                                            }
                                                            className="border-colorBorder"
                                                        />
                                                        <Input
                                                            type="number"
                                                            placeholder="Prix ($)"
                                                            min={0}
                                                            step={0.01}
                                                            value={ticket.price}
                                                            onChange={(e) =>
                                                                updateTicket(ticket.id, "price", e.target.value)
                                                            }
                                                            className="border-colorBorder"
                                                        />
                                                        <Input
                                                            type="number"
                                                            placeholder="Quantité"
                                                            min={1}
                                                            value={ticket.quantity}
                                                            onChange={(e) =>
                                                                updateTicket(ticket.id, "quantity", e.target.value)
                                                            }
                                                            className="border-colorBorder"
                                                        />
                                                    </div>
                                                    <Textarea
                                                        placeholder="Description (optionnel)"
                                                        value={ticket.description}
                                                        onChange={(e) =>
                                                            updateTicket(
                                                                ticket.id,
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                        rows={2}
                                                        className="resize-none border-colorBorder"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 5: Récapitulatif */}
                        {currentStep === 5 && (
                            <Card className="bg-bgCard border-colorBorder shadow-sm">
                                <CardHeader>
                                    <h2 className="text-[18px] font-semibold text-colorTitle">
                                        Récapitulatif
                                    </h2>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-[12px] text-colorMuted uppercase tracking-wide">
                                            Type
                                        </p>
                                        <p className="text-[14px] font-medium text-colorTitle">
                                            {formData.type}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] text-colorMuted uppercase tracking-wide">
                                            Titre
                                        </p>
                                        <p className="text-[14px] font-medium text-colorTitle">
                                            {formData.title}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] text-colorMuted uppercase tracking-wide">
                                            Description
                                        </p>
                                        <p className="text-[14px] text-colorTitle">
                                            {formData.description}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[12px] text-colorMuted uppercase tracking-wide">
                                                Date et heure
                                            </p>
                                            <p className="text-[14px] font-medium text-colorTitle">
                                                {formData.date && formData.time
                                                    ? `${new Date(formData.date + "T00:00:00").toLocaleDateString("fr-FR", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })} à ${formData.time}`
                                                    : "—"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-colorMuted uppercase tracking-wide">
                                                Lieu
                                            </p>
                                            <p className="text-[14px] font-medium text-colorTitle">
                                                {formData.location || "—"}
                                            </p>
                                        </div>
                                    </div>
                                    {tickets.length > 0 && (
                                        <div>
                                            <p className="text-[12px] text-colorMuted uppercase tracking-wide mb-2">
                                                Tickets ({totalPlaces()} places)
                                            </p>
                                            <ul className="space-y-2">
                                                {tickets.map((t) => (
                                                    <li
                                                        key={t.id}
                                                        className="text-[14px] text-colorTitle flex justify-between"
                                                    >
                                                        <span>{t.name}</span>
                                                        <span>
                                                            {t.price}$ × {t.quantity}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[12px] text-colorMuted uppercase tracking-wide">
                                            Hôtes
                                        </p>
                                        <ul className="mt-1 space-y-1">
                                            {hosts.map((h) => (
                                                <li
                                                    key={h.id}
                                                    className="text-[14px] text-colorTitle"
                                                >
                                                    {h.name} — {h.email}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-4 border-t border-colorBorder">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="gap-2 border-colorBorder"
                            >
                                <ArrowLeft size={16} />
                                Précédent
                            </Button>
                            {currentStep < 5 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!isStepValid()}
                                    className="gap-2 bg-primaryColor hover:bg-primaryColor/90 text-white"
                                >
                                    Suivant
                                    <ArrowRight size={16} />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={!isStepValid()}
                                    className="gap-2 bg-primaryColor hover:bg-primaryColor/90 text-white"
                                >
                                    Créer l&apos;événement
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AppContainer>
    );
};

export default Container;
