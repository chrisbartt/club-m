"use client";

import React, { JSX, ReactNode } from "react";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar-dashboard";
import TabBar from "@/components/layout/tab-bar";
import { DialogProvider } from "@/context/dialog-context";
import { DrawerProvider } from "@/context/drawer-context";
import { SidebarProvider } from "@/context/sidebar-context";

const Content = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={`wrapper-page flex transition-300 flex-col pb-[80px] lg:pb-0 lg:pl-[250px] min-h-screen w-full`}
    >
      <Navbar />
      {children}
    </div>
  );
};

function AppContainer({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <DrawerProvider>
      <DialogProvider>
        <SidebarProvider>
          <div className="global-div flex flex-col min-h-screen bg-bgFond">
            <Sidebar />
            <Content>{children}</Content>
            <TabBar />
          </div>
        </SidebarProvider>
      </DialogProvider>
    </DrawerProvider>
  );
}

export default AppContainer;
