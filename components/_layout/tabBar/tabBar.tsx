"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  Plus,
  Store,
  MessageSquare,
} from "lucide-react";

const linkClass =
  "flex flex-col items-center p-2 justify-center flex-1 gap-1 transition-colors rounded-lg relative";
const linkClassInactive = "text-white/80";
const linkClassActive = "text-primaryColor";
const centerButtonClass =
  "flex flex-col p-2 items-center justify-center flex-1 text-white/80 gap-1";

const TabBar = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isMembre = pathname.startsWith("/membre");

  const isActiveAdmin = (href: string) => {
    if (href === "/admin")
      return pathname === "/admin" || pathname === "/admin/";
    return pathname.startsWith(href);
  };
  const isActiveMembre = (href: string) => {
    if (href === "/membre")
      return pathname === "/membre" || pathname === "/membre/";
    return pathname.startsWith(href);
  };

  return (
    <div className="tabBar md:hidden fixed bottom-2 rounded-full left-1/2 -translate-x-1/2 w-[97%] z-50 bg-bgSidebar p-3 py-0 dark:border border-colorBorder">
         <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
      <div className="flex items-center w-full">
        {isAdmin && (
          <>
            <Link
              href="/admin"
              className={`${linkClass} ${isActiveAdmin("/admin") ? linkClassActive : linkClassInactive}`}
            >
              <LayoutDashboard size={20} />
              {isActiveAdmin("/admin") && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primaryColor rounded-full" />
              )}
            </Link>
            <Link
              href="/admin/business-alignes"
              className={`${linkClass} ${isActiveAdmin("/admin/business-alignes") ? linkClassActive : linkClassInactive}`}
            >
              <FileText size={20} />
              {isActiveAdmin("/admin/business-alignes") && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primaryColor rounded-full" />
              )}
            </Link>
           
            <div className={centerButtonClass}>
              <div className="w-[46px] h-[46px] flex justify-center items-center rounded-full relative z-10 -top-[14px]">
                <div className="absolute -inset-[4px] bg-bgSidebar/90 backdrop-blur-sm rounded-full -z-10">

                </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-[44px] h-[44px] min-w-0 p-0 bg-primaryColor rounded-full"
              >
                <Plus size={20} />
              </Button>
              </div>
            </div>
            <Link
              href="/admin/membres"
              className={`${linkClass} ${isActiveAdmin("/admin/membres") ? linkClassActive : linkClassInactive}`}
            >
              <Users size={20} />
              {isActiveAdmin("/admin/membres") && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primaryColor rounded-full" />
              )}
            </Link>
            <Link
              href="/admin/marketplace"
              className={`${linkClass} ${isActiveAdmin("/admin/marketplace") ? linkClassActive : linkClassInactive}`}
            >
              <Store size={20} />
              {isActiveAdmin("/admin/marketplace") && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primaryColor rounded-full" />
              )}
            </Link>
          </>
        )}

        {isMembre && (
          <>
            <Link
              href="/membre"
              className={`${linkClass} ${isActiveMembre("/membre") ? linkClassActive : linkClassInactive}`}
            >
              <LayoutDashboard size={20} />
              {isActiveMembre("/membre") && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primaryColor rounded-full" />
              )}
            </Link>
            <Link
              href="/membre/business-alignes"
              className={`${linkClass} ${isActiveMembre("/membre/business-alignes") ? linkClassActive : linkClassInactive}`}
            >
              <FileText size={20} />
              {isActiveMembre("/membre/business-alignes") && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primaryColor rounded-full" />
              )}
            </Link>
            <div className={centerButtonClass}>
            <div className="w-[46px] h-[46px] flex justify-center items-center rounded-full relative z-10 -top-[14px]">
                <div className="absolute -inset-[4px] bg-bgSidebar/90 backdrop-blur-sm rounded-full -z-10">

                </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-[44px] h-[44px] min-w-0 p-0 bg-primaryColor rounded-full"
              >
                <Plus size={20} />
              </Button>
              </div>
            </div>
            <Link
              href="/membre/marketplace"
              className={`${linkClass} ${isActiveMembre("/membre/marketplace") ? linkClassActive : linkClassInactive}`}
            >
              <Store size={20} />
              {isActiveMembre("/membre/marketplace") && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primaryColor rounded-full" />
              )}
            </Link>
            <Link
              href="/membre/messages"
              className={`${linkClass} ${isActiveMembre("/membre/messages") ? linkClassActive : linkClassInactive}`}
            >
              <MessageSquare size={20} />
              {isActiveMembre("/membre/messages") && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primaryColor rounded-full" />
              )}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default TabBar;
