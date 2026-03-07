import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import React from "react";

// Types
interface ContactItem {
    icon: React.ReactNode;
    iconBgColor: string;
    label: string;
    value: string;
}

// Contact Row Component
const ContactRow = ({ icon, iconBgColor, label, value }: ContactItem) => {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-colorBorder last:border-b-0">
            <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center ${iconBgColor}`}>
                {icon}
            </div>
            <div>
                <p className="text-[12px] text-colorMuted">{label}</p>
                <p className="text-[14px] font-medium text-colorTitle">{value}</p>
            </div>
        </div>
    );
};

// Mock Data
const contactData: ContactItem[] = [
    {
        icon: <Mail size={18} className="text-[#3b82f6]" />,
        iconBgColor: "bg-[#3b82f6]/10",
        label: "Email",
        value: "grace.mbeki@email.com",
    },
    {
        icon: <Phone size={18} className="text-[#25a04f]" />,
        iconBgColor: "bg-[#25a04f]/10",
        label: "Téléphone",
        value: "+243 99 123 4567",
    },
    {
        icon: <MessageCircle size={18} className="text-[#25a04f]" />,
        iconBgColor: "bg-[#25a04f]/10",
        label: "WhatsApp",
        value: "+243 99 123 4567",
    },
    {
        icon: <MapPin size={18} className="text-[#e63946]" />,
        iconBgColor: "bg-[#e63946]/10",
        label: "Ville",
        value: "Kinshasa, Gombe",
    },
];

const CardContact = () => {
    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden py-5 md:px-6 px-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[16px] font-semibold text-colorTitle">Contact</h3>
            </div>

            {/* Contact List */}
            <div className="flex flex-col">
                {contactData.map((item, index) => (
                    <ContactRow key={index} {...item} />
                ))}
            </div>
        </div>
    );
};

export default CardContact;
