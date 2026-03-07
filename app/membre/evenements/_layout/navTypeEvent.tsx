"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type EventTypeKey =
    | "tous"
    | "mes_evenements";

export const EVENT_TYPE_LABELS: Record<EventTypeKey, string> = {
    tous: "Tous les événements",
    mes_evenements: "Mes événements",
};

const NAV_ORDER: EventTypeKey[] = [
    "tous",
    "mes_evenements",
];

interface NavTypeEventProps {
    selectedType: EventTypeKey;
    onSelectType: (type: EventTypeKey) => void;
    counts: Partial<Record<EventTypeKey, number>>;
}

const SCROLL_STEP = 200;

const NavTypeEvent = ({
    selectedType,
    onSelectType,
    counts,
}: NavTypeEventProps) => {
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

    return (
        <div className="filter-nav-event flex items-center gap-2 py-[12px] bg-bgCard lg:px-4 px-3 2xl:px-6 border-t border-colorBorder sticky lg:top-[73px] top-[63px] z-50">
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
                {NAV_ORDER.map((type) => {
                    const count = counts[type] ?? 0;
                    const isActive = selectedType === type;
                    return (
                        <Button
                            key={type}
                            type="button"
                            onClick={() => onSelectType(type)}
                            className={`shrink-0 p-2 px-3 h-auto rounded-lg text-[13px] font-medium text-colorTitle justify-start hover:bg-bgCard/90 hover:text-colorTitle transition-all duration-300 cursor-pointer shadow-none gap-2 ${isActive ? "bg-bgSidebar dark:bg-bgGray text-white  hover:bg-bgSidebar/100 hover:text-white" : "bg-bgCard border border-colorBorder hover:bg-bgGray"
                                }`}
                        >
                            {EVENT_TYPE_LABELS[type]}
                            <span className={`text-[12px] ml-auto ${isActive ? "text-white/80" : "text-colorMuted"}`}>
                                ({count})
                            </span>
                        </Button>
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

export default NavTypeEvent;
