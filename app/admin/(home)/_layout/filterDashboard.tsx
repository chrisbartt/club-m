"use client";

import { Calendar } from "lucide-react";
import { useState } from "react";

type PeriodOption = "7" | "30" | "90" | "custom";

const FilterDashboard = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>("7");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const handlePeriodClick = (period: PeriodOption) => {
        setSelectedPeriod(period);
        if (period !== "custom") {
            setStartDate("");
            setEndDate("");
        }
    };

    const handleDateChange = (type: "start" | "end", value: string) => {
        if (type === "start") {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
        setSelectedPeriod("custom");
    };

    return (
        <div className="filter-dashboard md:flex hidden flex-wrap items-center gap-3 py-[12px] bg-bgCard lg:px-4 px-3 2xl:px-6 border-t border-colorBorder cardShadow sticky top-[73px] md:top-[71px] z-50">
            {/* Label Période */}
            <div className="flex items-center gap-2 text-colorMuted text-[14px]">
                <Calendar size={16} />
                <span>Période :</span>
            </div>

            {/* Period Buttons */}
            <div className="flex items-center rounded-lg overflow-hidden gap-1 mr-2">
                <button
                    onClick={() => handlePeriodClick("7")}
                    className={`px-4 py-2 text-[13px] font-medium transition-all cursor-pointer rounded-lg duration-200 ${selectedPeriod === "7"
                        ? "bg-bgSidebar dark:bg-bgGray text-white border-bgSidebar"
                        : "bg-bgCard text-colorTitle border border-colorBorder hover:bg-bgGray"
                        }`}
                >
                    7 jours
                </button>
                <button
                    onClick={() => handlePeriodClick("30")}
                    className={`px-4 py-2 text-[13px] font-medium transition-all cursor-pointer rounded-lg duration-200 ${selectedPeriod === "30"
                        ? "bg-bgSidebar dark:bg-bgGray text-white border-bgSidebar"
                        : "bg-bgCard text-colorTitle border border-colorBorder hover:bg-bgGray"
                        }`}
                >
                    30 jours
                </button>
                <button
                    onClick={() => handlePeriodClick("90")}
                    className={`px-4 py-2 text-[13px] font-medium  transition-all cursor-pointer rounded-lg duration-200 ${selectedPeriod === "90"
                        ? "bg-bgSidebar dark:bg-bgGray text-white border-bgSidebar"
                        : "bg-bgCard text-colorTitle border border-colorBorder hover:bg-bgGray"
                        }`}
                >
                    90 jours
                </button>
            </div>

            {/* Separator "ou" */}
            

            {/* Custom Date Range */}
            <div className="flex items-center gap-2 border-l border-colorBorder pl-4">

                {/* Start Date */}
                <span className="text-colorMuted text-[13px]">Du</span>
                <div className="relative">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => handleDateChange("start", e.target.value)}
                        className="w-[170px] px-3 py-2 text-[13px] border border-colorBorder rounded-lg text-colorTitle bg-bgCard focus:outline-none focus:border-bgSidebar transition-all duration-200 appearance-none"
                        placeholder="jj / mm / aaaa"
                    />
                    
                </div>

                {/* Separator "au" */}
                <span className="text-colorMuted text-[13px]">au</span>

                {/* End Date */}
                <div className="relative">
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => handleDateChange("end", e.target.value)}
                        className="w-[170px] px-3 py-2 text-[13px] border border-colorBorder rounded-lg text-colorTitle bg-bgCard focus:outline-none focus:border-bgSidebar transition-all duration-200 appearance-none"
                        placeholder="jj / mm / aaaa"
                    />
                   
                </div>
            </div>
        </div>
    );
};

export default FilterDashboard;
