"use client";

import {
    AlertTriangle,
    Banknote,
    Bell,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    LayoutDashboard,
    Package,
    Settings,
    ShoppingCart,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// Configuration des liens de navigation
const navLinks = [
    {
        href: "/admin/marketplace",
        label: "Dashboard",
        icon: LayoutDashboard,
    },

    {
        href: "/admin/marketplace/membres",
        label: "Membres",
        icon: Users,
    },
    {
        href: "/admin/marketplace/services",
        label: "Services",
        icon: Package,
    },
    {
        href: "/admin/marketplace/commandes",
        label: "Commandes",
        icon: ShoppingCart,
    },
    {
        href: "/admin/marketplace/litiges",
        label: "Litiges",
        icon: AlertTriangle,
    },
    {
        href: "/admin/marketplace/paiements-escrow",
        label: "Paiements et escrow",
        icon: Banknote,
    },
    {
        href: "/admin/marketplace/commissions-club-m",
        label: "Commissions Club M",
        icon: DollarSign,
    },
    {
        href: "/admin/marketplace/alertes-notifications",
        label: "Alertes et notifications",
        icon: Bell,
    },
    {
        href: "/admin/marketplace/parametres",
        label: "Paramètres",
        icon: Settings,
    },

];

const SCROLL_STEP = 200;

const FilterNavMarketPlace = () => {
    const pathname = usePathname();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(
            el.scrollLeft < el.scrollWidth - el.clientWidth - 1
        );
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollState();
        const ro = new ResizeObserver(updateScrollState);
        ro.observe(el);
        return () => ro.disconnect();
    }, [updateScrollState]);

    const scroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({
            left: direction === "left" ? -SCROLL_STEP : SCROLL_STEP,
            behavior: "smooth",
        });
    };

    const handleScroll = () => {
        updateScrollState();
    };

    // Vérifie si le lien est actif
    const isActive = (href: string) => {
        if (href === "/admin/marketplace") {
            return pathname === "/admin/marketplace";
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="filter-nav-membre flex items-center gap-2 py-[12px] bg-bgCard lg:px-4 px-3 2xl:px-6 border-t border-colorBorder sticky lg:top-[73px] top-[63px] z-50">
            <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Défiler vers la gauche"
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-colorBorder bg-bgCard text-colorTitle hover:bg-bgGray disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
            >
                <ChevronLeft size={18} />
            </button>
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex items-center gap-2 overflow-x-auto overflow-y-hidden scrollbar-hide min-w-0 flex-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${active
                                ? "bg-bgSidebar dark:bg-bgGray text-white"
                                : "bg-bgCard text-colorTitle border border-colorBorder hover:bg-bgGray"
                                }`}
                        >
                            <Icon size={16} />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </div>
            <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Défiler vers la droite"
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-colorBorder bg-bgCard text-colorTitle hover:bg-bgGray disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default FilterNavMarketPlace;
