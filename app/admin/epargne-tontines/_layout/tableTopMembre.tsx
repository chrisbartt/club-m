"use client";



// Types
interface Membre {
    id: string;
    initiales: string;
    nom: string;
    email: string;
    avatarColor: string;
    score: number;
}

// Mock Data - Top Membres
const mockMembres: Membre[] = [
    { id: "1", initiales: "MK", nom: "Marie K.", email: "marie.k@email.com", avatarColor: "bg-[#25a04f]", score: 98 },
    { id: "2", initiales: "EM", nom: "Esther M.", email: "esther.m@email.com", avatarColor: "bg-[#e68b3c]", score: 96 },
];

const TableTopMembre = () => {
    const totalMembres = mockMembres.length;

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-colorBorder">
                <h3 className="text-[16px] font-semibold text-colorTitle">Top Membres</h3>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[400px]">
                    <thead>
                        <tr className="border-b border-colorBorder bg-bgGray/50">
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Membre
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
                        {mockMembres.map((membre) => (
                            <tr
                                key={membre.id}
                                className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/30 transition-colors duration-200"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-white text-[13px] font-semibold ${membre.avatarColor}`}
                                        >
                                            {membre.initiales}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-semibold text-colorTitle">{membre.nom}</p>
                                            <p className="text-[12px] text-colorMuted">{membre.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#25a04f]/10 text-[#25a04f]">
                                        {membre.score}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[13px] font-medium text-colorMuted hover:text-colorTitle transition-colors">
                                        Profil
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
                    Affichage 1-{totalMembres} sur {totalMembres} membres
                </p>
            </div>
        </div>
    );
};

export default TableTopMembre;
