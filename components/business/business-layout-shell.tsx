"use client";

import { SidebarProvider } from "@/context/sidebar-context";
import BusinessSidebar from "@/components/business/business-sidebar";
import BusinessNavbar from "@/components/business/business-navbar";

export function BusinessLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="global-div flex flex-col min-h-screen bg-bgFond">
        <BusinessSidebar />
        <div className="wrapper-page flex transition-300 flex-col pb-[80px] lg:pb-0 lg:pl-[250px] min-h-screen w-full">
          <BusinessNavbar />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
