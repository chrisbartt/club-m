"use client";

import {
  Calendar,
  CalendarCheck,
  DollarSign,
  FileText,
  Minus,
  PiggyBank,
  RefreshCw,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import React, { useEffect, useState } from "react";

// Types
interface StatCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  value: string | number;
  label: string;
  subtitle: string;
  isLoading?: boolean;
  badge?: {
    value: string;
    type: "up" | "stable" | "down";
  };
  bottomStats?: {
    label: string;
    value: string | number;
    color: string;
  }[];
}

interface FinanceCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  value: string;
  label: string;
  subtitle: string;
  badge?: {
    value: string;
    type: "up" | "stable" | "down";
  };
  details: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }[];
}

interface AdminStats {
  totalMembres: number;
  membresActifs: number;
  membresBusiness: number;
  membresPremium: number;
  membresFree: number;
  pendingCount: number;
  nouveauxCeMois: number;
}

// Badge Component
const Badge = ({
  value,
  type,
}: {
  value: string;
  type: "up" | "stable" | "down";
}) => {
  const bgColor =
    type === "up"
      ? "bg-[#25a04f]/10 text-[#25a04f]"
      : type === "down"
        ? "bg-red-100 text-red-600"
        : "bg-bgGray text-colorMuted";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${bgColor}`}
    >
      {type === "up" && <TrendingUp size={12} />}
      {type === "stable" && <Minus size={12} />}
      {value}
    </span>
  );
};

// Skeleton loader pour les valeurs
const ValueSkeleton = () => (
  <div className="h-[32px] w-[60px] bg-bgGray animate-pulse rounded md:h-[38px]" />
);

// Stat Card Component
const StatCard = ({
  icon,
  iconBgColor,
  value,
  label,
  subtitle,
  badge,
  bottomStats,
  isLoading,
}: StatCardProps) => {
  return (
    <div className="bg-bgCard rounded-xl p-4 flex flex-col gap-3 cardShadow h-full">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div
            className={`w-[42px] h-[42px] rounded-lg flex items-center justify-center ${iconBgColor}`}
          >
            {icon}
          </div>
          {badge && <Badge value={badge.value} type={badge.type} />}
        </div>
        {/* Value */}
        <div>
          {isLoading ? (
            <div className="mb-4">
              <ValueSkeleton />
            </div>
          ) : (
            <p className="md:text-[32px] text-[28px] font-bold text-colorTitle leading-none mb-4">
              {value}
            </p>
          )}
          {/* Label & Subtitle */}
          <div>
            <p className="text-[14px] font-medium text-colorTitle">{label}</p>
            <p className="text-[12px] text-colorMuted">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      {bottomStats && bottomStats.length > 0 && (
        <div className="gap-2 flex flex-col gap-2 p-3 mt-auto rounded-lg bg-bgGray">
          {bottomStats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 text-[12px] justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${stat.color}`}
                ></span>
                <span className="text-colorTitle font-medium">
                  {stat.label}
                </span>
              </div>
              <span className="text-colorMuted text-sm">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Finance Card Component
const FinanceCard = ({
  icon,
  iconBgColor,
  value,
  label,
  subtitle,
  badge,
  details,
}: FinanceCardProps) => {
  return (
    <div className="bg-primaryColor rounded-xl p-4 flex flex-col gap-3 cardShadow h-full relative z-10">
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div
            className={`w-[42px] h-[42px] rounded-lg flex items-center justify-center ${iconBgColor}`}
          >
            {icon}
          </div>
          {badge && <Badge value={badge.value} type={badge.type} />}
        </div>
        <div className="col-span-12">
          {/* Value */}
          <div>
            <p className="md:text-[32px] text-[28px] font-bold text-white leading-none mb-3">
              {value}
            </p>
          </div>

          {/* Label & Subtitle */}
          <div>
            <p className="text-[14px] font-medium text-white">{label}</p>
            <p className="text-[12px] text-white/80">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="col-span-12">
          {/* Details List */}
          <div className="flex flex-col gap-2 p-3 bg-black/30 backdrop-blur-[10px] rounded-lg">
            {details.map((detail, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-[13px]"
              >
                <div className="flex items-center gap-2 text-white/80">
                  {detail.icon}
                  <span>{detail.label}</span>
                </div>
                <span className="font-semibold text-white text-sm">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CardsWidgets = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Erreur fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="cards-widgets">
      {/* Cards Row - 6 Cards (Scrollable) */}
      <div className="grid grid-cols-12 gap-3 lg:gap-4">
        <div className="col-span-12 lg:col-span-6 gap-3 lg:gap-4">
          <div className="grid grid-cols-12 gap-3 lg:gap-4 h-full">
            <div className="col-span-12 lg:col-span-6">
              <FinanceCard
                icon={
                  <DollarSign size={20} className="text-primaryColor" />
                }
                iconBgColor="bg-bgCard"
                value="$15 612"
                label="Vue financière"
                subtitle="Revenus période sélectionnée"
                badge={{ value: "+18%", type: "up" }}
                details={[
                  {
                    icon: <Wallet size={14} />,
                    label: "Épargne cumulée",
                    value: "$45,230",
                  },
                  {
                    icon: <RefreshCw size={14} />,
                    label: "Abonnements récurrents",
                    value: "$12,840",
                  },
                  {
                    icon: <Calendar size={14} />,
                    label: "CA événements",
                    value: "$4,380",
                  },
                ]}
              />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <StatCard
                icon={<Users size={20} className="text-white" />}
                iconBgColor="bg-bgSidebar dark:bg-bgGray"
                value={stats?.totalMembres ?? "—"}
                label="Membres actifs"
                subtitle={`${stats?.membresActifs ?? 0} vérifiés`}
                isLoading={isLoading}
                badge={
                  stats && stats.nouveauxCeMois > 0
                    ? {
                        value: `+${stats.nouveauxCeMois}`,
                        type: "up",
                      }
                    : { value: "stable", type: "stable" }
                }
                bottomStats={[
                  {
                    label: "Business",
                    value: stats?.membresBusiness ?? 0,
                    color: "bg-orange-500",
                  },
                  {
                    label: "Premium",
                    value: stats?.membresPremium ?? 0,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Free",
                    value: stats?.membresFree ?? 0,
                    color: "bg-green-500",
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 h-full">
          <div className="grid grid-cols-12 gap-3 lg:gap-4 h-full">
            <div className="col-span-12 lg:col-span-6">
              <StatCard
                icon={<UserPlus size={20} className="text-white" />}
                iconBgColor="bg-[#25a04f]"
                value={stats?.pendingCount ?? "—"}
                label="Demandes d'adhésion"
                subtitle={`${stats?.pendingCount ?? 0} en attente de validation`}
                isLoading={isLoading}
                badge={
                  stats && stats.pendingCount > 0
                    ? {
                        value: `+${stats.pendingCount}`,
                        type: "up",
                      }
                    : { value: "0", type: "stable" }
                }
              />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <StatCard
                icon={<FileText size={20} className="text-white" />}
                iconBgColor="bg-[#3b82f6]"
                value="89"
                label="Business Plans en cours"
                subtitle="67 finalisés ce trimestre"
                badge={{ value: "+8", type: "up" }}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <StatCard
                icon={<PiggyBank size={20} className="text-white" />}
                iconBgColor="bg-[#e68b3c]"
                value="45"
                label="Tontines actives"
                subtitle="45,230 $ cumulés"
                badge={{ value: "stable", type: "stable" }}
              />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <StatCard
                icon={<CalendarCheck size={20} className="text-white" />}
                iconBgColor="bg-[#8c49b1]"
                value="6"
                label="Ateliers & Coachings"
                subtitle="Ce mois-ci"
                badge={{ value: "+3", type: "up" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsWidgets;
