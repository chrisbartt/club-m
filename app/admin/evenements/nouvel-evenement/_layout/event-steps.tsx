"use client";


const STEPS = [
    { number: 1, label: "Type d'événement" },
    { number: 2, label: "Informations" },
    { number: 3, label: "Participants" },
    { number: 4, label: "Catégories de prix" },
    { number: 5, label: "Récapitulatif" },
];

interface EventStepsProps {
    currentStep: number;
}

const EventSteps = ({ currentStep }: EventStepsProps) => {
    const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

    return (
        <div className="relative mb-8 w-full">
            <div className="content-step flex relative z-10 w-full items-center justify-between">
                <div
                    className="line absolute left-0 h-[2px] w-full -z-10 rounded-full bg-colorBorder"
                    aria-hidden
                />
                <div
                    className="line absolute left-0 h-[2px] -z-10 rounded-full bg-bgSidebar transition-all duration-300 ease-in-out"
                    style={{ width: `${progressPercentage}%` }}
                    aria-hidden
                />
                {STEPS.map((step) => {
                    const isActive = step.number <= currentStep;
                    return (
                        <div
                            key={step.number}
                            className="item-step flex flex-col items-center justify-center"
                        >
                            <div
                                className={`num flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors duration-300 ${isActive
                                        ? "bg-bgSidebar text-white"
                                        : "bg-bgGray text-colorMuted"
                                    }`}
                            >
                                {step.number}
                            </div>
                            <span
                                className={`absolute top-[130%] hidden whitespace-nowrap text-center text-xs transition-colors duration-300 md:block ${isActive
                                        ? "text-colorTitle"
                                        : "text-colorMuted"
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EventSteps;
