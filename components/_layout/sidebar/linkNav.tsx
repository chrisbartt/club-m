import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkNavProps {
  icon?: React.ReactNode;
  title: string;
  href: string;
  badge?: number;
  statusIcon?: React.ReactNode; // Icône de statut à afficher à droite (ex: coche verte)
}

const LinkNav = ({ icon, title, href, badge, statusIcon }: LinkNavProps) => {
  const pathname = usePathname();
  
  // Normaliser les chemins (enlever le trailing slash)
  const normalizedPathname = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const normalizedHref = href.endsWith("/") && href !== "/" ? href.slice(0, -1) : href;
  
  // Déterminer si le lien est actif
  let isActive = false;
  
  if (normalizedHref === "" || normalizedHref === "/membre" || normalizedHref === "/admin") {
    // Pour les pages d'accueil, être actif uniquement si on est exactement sur cette page
    isActive = normalizedPathname === normalizedHref || normalizedPathname === `${normalizedHref}/`;
  } else {
    // Pour les autres pages, être actif si le pathname commence par le href
    isActive = normalizedPathname === normalizedHref || normalizedPathname.startsWith(`${normalizedHref}/`);
  }

  return (
    <Link
      href={href}
      className={`link relative flex items-center  py-[12px] px-[14px] text-sm font-medium gap-2 transition-all duration-300 rounded-lg hover:text-white ${isActive ? "text-white bg-[#ffffff0d] backdrop-blur-[10px]" : "text-white/80"
        }`}
    >
     
      <div className={`${isActive ? "text-primaryColor" : ""}`}>
        {icon}
      </div>
      {/* <span className="line-dot absolute w-[18px] h-[15px] border-b border-b-[#8a8a96] left-[-25px] top-[6px] border-l border-l-[#8a8a96] rounded-bl-[8px]">
        <span className="w-[5px] h-[5px] bg-[#8a8a96] rounded-full absolute left-[-3px] top-[0px]"></span>
      </span> */}
      <span className="title">{title}</span>
      <div className="ml-auto flex items-center gap-2">
        {statusIcon && statusIcon}
        {badge !== undefined && badge > 0 && (
          <span className="badge bg-[#d92828] leading-none text-white text-[11px] py-[3px] px-[8px] flex items-center justify-center rounded-full">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};

export default LinkNav;
