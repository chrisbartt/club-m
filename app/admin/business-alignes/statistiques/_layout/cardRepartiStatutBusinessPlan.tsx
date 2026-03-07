"use client";

import ApexCharts from "apexcharts";
import { useEffect, useRef } from "react";

// Données : En cours 28 (67%), Terminés 11 (26%), Bloqués 5 (12%), Abandonnés 3 (7%)
const chartData = {
    series: [28, 11, 5, 3],
    labels: ["En cours", "Terminés", "Bloqués", "Abandonnés"],
    colors: ["#3a86ff", "#25a04f", "#e68b3c", "#dd3d3d"],
};

const CardRepartiStatutBusinessPlan = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const options: ApexCharts.ApexOptions = {
            chart: {
                type: "donut",
                fontFamily: "inherit",
            },
            series: chartData.series,
            labels: chartData.labels,
            colors: chartData.colors,
            legend: {
                position: "bottom",
                fontSize: "13px",
                labels: {
                    colors: "#6b7280",
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
                                color: "#374151",
                                formatter: () => "47 BA",
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
                    formatter: (val: number) => `${val} BA`,
                },
            },
        };

        const chart = new ApexCharts(chartRef.current, options);
        chart.render();

        return () => {
            chart.destroy();
        };
    }, []);

    return (
        <div className="w-full card cardShadow bg-bgCard rounded-xl overflow-hidden py-5 md:px-6 px-5">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-[16px] font-semibold text-colorTitle">Répartition par statut</h3>
                <p className="text-[13px] text-colorMuted mt-0.5">Business alignés par statut</p>
            </div>

            {/* Pie Chart */}
            <div ref={chartRef} className="min-h-[280px]" />

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:gap-3 gap-2 mt-6 pt-4 border-t border-colorBorder">
                <div className="rounded-lg p-3 bg-[#3a86ff]/5 ">
                    <p className="text-[22px] font-bold text-[#3a86ff]">28</p>
                    <p className="text-[12px] text-colorMuted">En cours (67%)</p>
                </div>
                <div className="rounded-lg p-3 bg-[#25a04f]/5 ">
                    <p className="text-[22px] font-bold text-[#25a04f]">11</p>
                    <p className="text-[12px] text-colorMuted">Terminés (26%)</p>
                </div>
                <div className="rounded-lg p-3 bg-[#e68b3c]/5 ">
                    <p className="text-[22px] font-bold text-[#e68b3c]">5</p>
                    <p className="text-[12px] text-colorMuted">Bloqués (12%)</p>
                </div>
                <div className="rounded-lg p-3 bg-[#dd3d3d]/5 ">
                    <p className="text-[22px] font-bold text-[#dd3d3d]">3</p>
                    <p className="text-[12px] text-colorMuted">Abandonnés (7%)</p>
                </div>
            </div>
        </div>
    );
};

export default CardRepartiStatutBusinessPlan;
