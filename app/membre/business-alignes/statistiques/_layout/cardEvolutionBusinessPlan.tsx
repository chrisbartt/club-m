"use client";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Chart Data - Evolution annuelle des Business Plans
const chartData = [
    { month: "Jan", crees: 3, finalises: 1 },
    { month: "Fév", crees: 5, finalises: 2 },
    { month: "Mar", crees: 4, finalises: 1 },
    { month: "Avr", crees: 6, finalises: 3 },
    { month: "Mai", crees: 8, finalises: 2 },
    { month: "Juin", crees: 5, finalises: 4 },
    { month: "Juil", crees: 7, finalises: 3 },
    { month: "Août", crees: 4, finalises: 2 },
    { month: "Sep", crees: 6, finalises: 5 },
    { month: "Oct", crees: 9, finalises: 4 },
    { month: "Nov", crees: 7, finalises: 3 },
    { month: "Déc", crees: 5, finalises: 2 },
];

// Chart Config
const chartConfig = {
    crees: {
        label: "BP Créés",
        color: "#3a86ff",
    },
    finalises: {
        label: "BP Finalisés",
        color: "#25a04f",
    },
} satisfies ChartConfig;

const CardEvolutionBusinessPlan = () => {
    return (
        <div className="w-full card cardShadow bg-bgCard rounded-xl overflow-hidden py-5 px-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Évolution des Business Plans</h3>
                    <p className="text-[13px] text-colorMuted">Statistiques annuelles 2026</p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-bgSidebar" />
                        <span className="text-[12px] text-colorMuted">BP Créés</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-[#25a04f]" />
                        <span className="text-[12px] text-colorMuted">BP Finalisés</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={chartData} barGap={4}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        fontSize={12}
                        stroke="#888"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        fontSize={12}
                        stroke="#888"
                    />
                    <ChartTooltip
                        cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                        content={<ChartTooltipContent />}
                    />
                    <Bar
                        dataKey="crees"
                        fill="#3a86ff"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={32}
                    />
                    <Bar
                        dataKey="finalises"
                        fill="#25a04f"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={32}
                    />
                </BarChart>
            </ChartContainer>

            {/* Summary */}
            <div className="flex items-center justify-center gap-8 mt-6 pt-4 border-t border-colorBorder">
                <div className="text-center">
                    <p className="text-[24px] font-bold text-colorTitle">69</p>
                    <p className="text-[12px] text-colorMuted">Total BP créés</p>
                </div>
                <div className="text-center">
                    <p className="text-[24px] font-bold text-[#25a04f]">32</p>
                    <p className="text-[12px] text-colorMuted">Total BP finalisés</p>
                </div>
                <div className="text-center">
                    <p className="text-[24px] font-bold text-[#e68b3c]">46%</p>
                    <p className="text-[12px] text-colorMuted">Taux de complétion</p>
                </div>
            </div>
        </div>
    );
};

export default CardEvolutionBusinessPlan;
