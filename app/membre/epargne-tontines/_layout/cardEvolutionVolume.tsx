"use client";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Chart Data - Évolution du volume épargné (mensuel)
const chartData = [
    { month: "Jan", volume: 9200 },
    { month: "Fév", volume: 10500 },
    { month: "Mar", volume: 9800 },
    { month: "Avr", volume: 11200 },
    { month: "Mai", volume: 12400 },
    { month: "Juin", volume: 11800 },
    { month: "Juil", volume: 13200 },
    { month: "Août", volume: 10800 },
    { month: "Sep", volume: 14100 },
    { month: "Oct", volume: 12800 },
    { month: "Nov", volume: 11500 },
    { month: "Déc", volume: 10200 },
];

// Format number for consistent SSR/client (avoid hydration mismatch)
function formatNumber(n: number): string {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Chart Config
const chartConfig = {
    volume: {
        label: "Volume épargné",
        color: "#3a86ff",
    },
} satisfies ChartConfig;

const CardEvolutionVolume = () => {
    const totalVolume = chartData.reduce((acc, d) => acc + d.volume, 0);
    const moyenneMensuelle = Math.round(totalVolume / chartData.length);
    const maxVolume = Math.max(...chartData.map((d) => d.volume));

    return (
        <div className="w-full card cardShadow bg-bgCard rounded-xl overflow-hidden py-5 px-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Évolution du volume</h3>
                    <p className="text-[13px] text-colorMuted">Volume épargné par mois — 2026</p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-[#3a86ff]" />
                    <span className="text-[12px] text-colorMuted">Volume épargné</span>
                </div>
            </div>

            {/* Chart */}
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={chartData} barGap={4}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--colorBorder)" />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        fontSize={12}
                        stroke="var(--colorMuted)"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        fontSize={12}
                        stroke="var(--colorMuted)"
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip
                        cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                        content={<ChartTooltipContent formatter={(v) => [`$${Number(v).toLocaleString()}`, "Volume"]} />}
                    />
                    <Bar
                        dataKey="volume"
                        fill="#3a86ff"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={48}
                    />
                </BarChart>
            </ChartContainer>

            {/* Summary */}
            <div className="flex items-center justify-center gap-8 mt-6 pt-4 border-t border-colorBorder">
                <div className="text-center">
                    <p className="text-[24px] font-bold text-colorTitle">${formatNumber(totalVolume)}</p>
                    <p className="text-[12px] text-colorMuted">Volume total</p>
                </div>
                <div className="text-center">
                    <p className="text-[24px] font-bold text-[#25a04f]">${formatNumber(moyenneMensuelle)}</p>
                    <p className="text-[12px] text-colorMuted">Moyenne mensuelle</p>
                </div>
                <div className="text-center">
                    <p className="text-[24px] font-bold text-[#e68b3c]">${formatNumber(maxVolume)}</p>
                    <p className="text-[12px] text-colorMuted">Pic mensuel</p>
                </div>
            </div>
        </div>
    );
};

export default CardEvolutionVolume;
