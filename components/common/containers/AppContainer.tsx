"use client";

import React, { JSX, ReactNode } from "react";
import Sidebar from "../../_layout/sidebar/sidebar";
import Navbar from "../../_layout/navbar-dashboard/navbar";
import TabBar from "../../_layout/tabBar/tabBar";
import { DialogProvider } from "@/context/dialog/contextDialog";
import { DrawerProvider } from "@/context/drawer/contextDrawer";
import { SidebarProvider } from "@/context/sidebarContext/sidebarContext";

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
