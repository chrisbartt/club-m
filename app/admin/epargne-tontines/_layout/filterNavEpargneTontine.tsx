"use client";

import {
    AlertTriangle,
    Banknote,
    Bell,
    ChevronLeft,
    ChevronRight,
    FileSpreadsheet,
    LayoutDashboard,
    PiggyBank,
    UserPlus,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// Configuration des liens de navigation
const navLinks = [
    {
        href: "/admin/epargne-tontines",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        href: "/admin/epargne-tontines/tontines",
        label: "Tontines",
        icon: PiggyBank,
    },
    {
        href: "/admin/epargne-tontines/membres",
        label: "Membres",
        icon: Users,
    },
    {
        href: "/admin/epargne-tontines/demandes",
        label: "Demandes",
        icon: UserPlus,
    },
    {
        href: "/admin/epargne-tontines/alertes",
        label: "Alertes",
        icon: AlertTriangle,
    },
    {
        href: "/admin/epargne-tontines/notifications",
        label: "Notifications",
        icon: Bell,
    },
    {
        href: "/admin/epargne-tontines/donnees-bancaires",
        label: "Données bancaires",
        icon: Banknote,
    },
    {
        href: "/admin/epargne-tontines/exports-rapports",
        label: "Exports & Rapports",
        icon: FileSpreadsheet,
    },

];

const SCROLL_STEP = 200;

const FilterNavEpargneTontine = () => {
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

    const isActive = (href: string) => {
        if (href === "/admin/epargne-tontines") {
            return pathname === "/admin/epargne-tontines";
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="filter-nav-membre flex items-center gap-2 py-[12px] bg-bgCard lg:px-4 px-3 2xl:px-6 border-t border-colorBorder sticky lg:top-[73px] top-[11.6%] z-50">
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
                onScroll={updateScrollState}
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
                                : "bg-bgGcard text-colorTitle border border-colorBorder hover:bg-bgGray"
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

export default FilterNavEpargneTontine;
