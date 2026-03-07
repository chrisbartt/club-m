"use client";
import Link from "next/link";

const DashboardHeader = () => {
    return (
        <div className="bg-bgSidebar dark:bg-bgGray rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6 lg:mt-6 relative overflow-hidden z-10">
            {/* Pattern de fond */}
            <div className="absolute inset-0 pointer-events-none -z-10 opacity-20" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
            
            {/* Top Section: Greeting and Navigation */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                {/* Greeting Section */}
                <div className="flex-1">
                    <h1 className="text-[28px] lg:text-[36px] font-bold text-white mb-2">
                        Bonjour, Marie 👋
                    </h1>
                    <p className="text-[14px] lg:text-[16px] text-white/90 leading-relaxed">
                        Tu fais partie des membres Business du Club M. 
                        Tu as accès à l&apos;ensemble des modules pour structurer, 
                        financer et développer ton projet.
                    </p>
                </div>

                
            </div>

            {/* KPIs Section */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-[32px] lg:text-[40px] font-bold text-white mb-1">92%</div>
                    <div className="text-[13px] text-white/80">BUSINESS ALIGNÉ</div>
                </div>
                {/* <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-[32px] lg:text-[40px] font-bold text-white mb-1">2</div>
                    <div className="text-[13px] text-white/80">TONTINES</div>
                </div> */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-[32px] lg:text-[40px] font-bold text-white mb-1">5</div>
                    <div className="text-[13px] text-white/80">ÉVÉNEMENTS</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-[32px] lg:text-[40px] font-bold text-white mb-1">3</div>
                    <div className="text-[13px] text-white/80">OFFRES PUBLIÉES</div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href="/membre/business-alignes"
                    className="flex-1 flex items-center text-white justify-center gap-2 px-6 py-3 bg-primaryColor hover:bg-primaryColor/90 dark:text-colorTitle font-semibold rounded-lg transition-colors"
                >
                    <span>Continuer mon Business Aligné</span>
                </Link>
                <Link
                    href="/membre/evenements"
                    className="flex-1 flex items-center backdrop-blur-sm justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors border border-white/20"
                >
                    <span>Voir les événements</span>
                </Link>
            </div>
        </div>
    );
};

export default DashboardHeader;
