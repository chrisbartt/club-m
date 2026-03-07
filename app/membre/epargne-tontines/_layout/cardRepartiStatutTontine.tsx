"use client";

import { useEffect, useRef, useState } from "react";

// Données : Actives 8 (44%), À venir 6 (33%), Terminées 4 (22%)
const chartData = {
    series: [8, 6, 4],
    labels: ["Actives", "À venir", "Terminées"],
    colors: ["#25a04f", "#3a86ff", "#102844"],
};

const totalTontines = chartData.series.reduce((a, b) => a + b, 0);

const CardRepartiStatutTontine = () => {
    const [mounted, setMounted] = useState(false);
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<{ destroy: () => void } | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !chartRef.current || typeof window === "undefined") return;

        const ref = chartRef.current;

        void import("apexcharts").then(({ default: ApexCharts }) => {
            const options: ApexCharts.ApexOptions = {
                chart: {
                    type: "donut",
                    fontFamily: "inherit",
                },
                series: chartData.series,
                labels: chartData.labels,
                colors: chartData.colors,
                stroke: {
                    show: true,
                    width: 2,
                    colors: ["var(--bgCard)"],
                },
                legend: {
                    position: "bottom",
                    fontSize: "13px",
                    labels: {
                        colors: "var(--colorMuted)",
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: (val: number) => `${Math.round(val)}%`,
                    style: {
                        fontSize: "12px",
                    },
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: "65%",
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: "Total",
                                    fontSize: "14px",
                                    color: "var(--colorTitle)",
                                    formatter: () => `${totalTontines} Tontines`,
                                },
                                value: {
                                    fontSize: "20px",
                                    fontWeight: 700,
                                    color: "#111827",
                                },
                            },
                        },
                    },
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val} tontine(s)`,
                    },
                },
            };

            const chart = new ApexCharts(ref, options);
            chartInstanceRef.current = chart;
            chart.render();
        });

        return () => {
            chartInstanceRef.current?.destroy();
            chartInstanceRef.current = null;
        };
    }, [mounted]);

    return (
        <div className="w-full card cardShadow bg-bgCard rounded-xl overflow-hidden py-5 px-6">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-[16px] font-semibold text-colorTitle">Répartition par statut</h3>
                <p className="text-[13px] text-colorMuted mt-0.5">Tontines par statut</p>
            </div>

            {/* Pie Chart - container only on client to avoid hydration mismatch */}
            <div className="min-h-[280px]">
                {mounted && <div ref={chartRef} className="min-h-[280px]" />}
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-colorBorder">
                <div className="rounded-lg p-3 bg-[#25a04f]/5">
                    <p className="text-[22px] font-bold text-[#25a04f]">8</p>
                    <p className="text-[12px] text-colorMuted">Actives (44%)</p>
                </div>
                <div className="rounded-lg p-3 bg-[#3a86ff]/5">
                    <p className="text-[22px] font-bold text-[#3a86ff]">6</p>
                    <p className="text-[12px] text-colorMuted">À venir (33%)</p>
                </div>
                <div className="rounded-lg p-3 bg-bgGray">
                    <p className="text-[22px] font-bold text-colorTitle">4</p>
                    <p className="text-[12px] text-colorMuted">Terminées (22%)</p>
                </div>
            </div>
        </div>
    );
};

export default CardRepartiStatutTontine;
