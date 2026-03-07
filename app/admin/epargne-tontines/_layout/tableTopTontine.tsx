"use client";


// Types
interface Tontine {
    id: string;
    nom: string;
    ponctualite: number;
    score: string;
}

// Progress Bar - barre verte + pourcentage à droite
const PonctualiteBar = ({ value }: { value: number }) => (
    <div className="flex items-center gap-3">
        <div className="flex-1 min-w-[80px] max-w-[140px] h-[6px] bg-bgGray rounded-full overflow-hidden">
            <div
                className="h-full rounded-full bg-[#25a04f] transition-all duration-300"
                style={{ width: `${value}%` }}
            />
        </div>
        <span className="text-[14px] font-medium text-colorTitle w-9 shrink-0">{value}%</span>
    </div>
);

// Mock Data - Top Tontines
const mockTontines: Tontine[] = [
    { id: "1", nom: "Tontine Solidarité", ponctualite: 96, score: "A+" },
    { id: "2", nom: "Tontine Entraide", ponctualite: 94, score: "A" },
];

const TableTopTontine = () => {
    const totalTontines = mockTontines.length;

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-colorBorder">
                <h3 className="text-[16px] font-semibold text-colorTitle">Top Tontines</h3>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                    <thead>
                        <tr className="border-b border-colorBorder bg-bgGray/50">
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Tontine
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Ponctualité
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Score
                            </th>
                            <th className="text-right text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockTontines.map((tontine) => (
                            <tr
                                key={tontine.id}
                                className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/30 transition-colors duration-200"
                            >
                                <td className="px-6 py-4">
                                    <p className="text-[14px] font-semibold text-colorTitle">{tontine.nom}</p>
                                </td>
                                <td className="px-4 py-4">
                                    <PonctualiteBar value={tontine.ponctualite} />
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#25a04f]/10 text-[#25a04f]">
                                        {tontine.score}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[13px] font-medium text-colorMuted hover:text-colorTitle transition-colors">
                                        Gérer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-colorBorder">
                <p className="text-[13px] text-colorMuted">
                    Affichage 1-{totalTontines} sur {totalTontines} tontines
                </p>
            </div>
        </div>
    );
};

export default TableTopTontine;
