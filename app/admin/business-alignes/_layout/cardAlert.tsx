import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowRight,
  Lightbulb,
  MessageCircle,
  UserX,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";

// Types
type AlertType = "bloque" | "urgent" | "info";

interface AlertItem {
  id: string;
  type: AlertType;
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
  secondaryInfo: string;
  button: {
    label: string;
    icon?: React.ReactNode;
    variant: "primary" | "danger" | "outline";
  };
}

// Alert Row Component
const AlertRow = ({
  type,
  icon,
  iconBgColor,
  title,
  description,
  secondaryInfo,
  button,
}: AlertItem) => {
  const bgColors = {
    bloque: "bg-[#e68b3c]/10",
    urgent: "bg-[#8c49b1]/10",
    info: "bg-[#3a86ff]/10",
  };

  const buttonStyles = {
    primary: "bg-bgSidebar text-white hover:bg-bgSidebar/90",
    danger: "bg-[#e68b3c] text-white hover:bg-[#e68b3c]/90",
    outline:
      "bg-white border border-colorBorder text-colorTitle hover:bg-bgGray",
  };

  return (
    <div className={`p-4 flex flex-col gap-2 rounded-xl ${bgColors[type]}`}>
      {/* Icon */}
      <div className="flex items-start gap-4 ">
        <div
          className={`w-[44px] h-[44px] rounded-full flex items-center justify-center flex-shrink-0 ${iconBgColor}`}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-colorTitle mb-1">
            {title}
          </p>
          <p className="text-[13px] text-colorMuted mb-1">{description}</p>
          <p className="text-[12px] text-colorMuted">{secondaryInfo}</p>
        </div>

        {/* Button */}
        <Button
          className={`h-9 px-4 text-[13px] hidden md:flex font-medium gap-2 shadow-none flex-shrink-0 ${buttonStyles[button.variant]}`}
        >
          {button.icon}
          {button.label}
        </Button>
      </div>
      <Button
        className={`h-9 px-4 text-[13px] font-medium gap-2 shadow-none flex items-center justify-center md:hidden flex-shrink-0 ${buttonStyles[button.variant]}`}
      >
        {button.icon}
        {button.label}
      </Button>
    </div>
  );
};

// Mock Data
const alertsData: AlertItem[] = [
  {
    id: "1",
    type: "bloque",
    icon: <UserX size={20} className="text-[#e68b3c]" />,
    iconBgColor: "bg-[#e68b3c]/20",
    title: "Aline Makoso - Bloquée depuis 8 jours",
    description: 'Étape "Étude de marché" - Dernière connexion le 25 Jan',
    secondaryInfo: 'BP: "Boutique Aline Mode" • Avancement: 35%',
    button: {
      label: "Relancer",
      icon: <MessageCircle size={14} />,
      variant: "primary",
    },
  },
  {
    id: "2",
    type: "urgent",
    icon: <AlertCircle size={20} className="text-[#8c49b1]" />,
    iconBgColor: "bg-[#8c49b1]/20",
    title: "Flora Tshimanga - Deadline dépassée",
    description: 'Étape "Prévisions financières" en retard de 5 jours',
    secondaryInfo: 'BP: "Flora Boutique" • Avancement: 28%',
    button: {
      label: "Urgent",
      icon: <Zap size={14} />,
      variant: "danger",
    },
  },
  {
    id: "3",
    type: "info",
    icon: <Lightbulb size={20} className="text-bgSidebar" />,
    iconBgColor: "bg-bgSidebar/20",
    title: "3 BP proches de finalisation",
    description: "Marie K., Esther M., Grace N. - Avancement > 85%",
    secondaryInfo: "Encouragement recommandé pour la dernière ligne droite",
    button: {
      label: "Voir",
      variant: "outline",
    },
  },
];

const CardAlert = () => {
  return (
    <div className="w-full card cardShadow bg-bgCard rounded-xl overflow-hidden py-5 md:px-6 px-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-semibold text-colorTitle">
            Membres à accompagner
          </h3>
        </div>
        <Link
          href="/admin/business-alignes/alertes"
          className="flex items-center gap-1 text-[13px] font-medium text-colorMuted hover:text-colorTitle transition-colors"
        >
          Voir tout <ArrowRight size={14} />
        </Link>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {alertsData.map((item) => (
          <AlertRow key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default CardAlert;
