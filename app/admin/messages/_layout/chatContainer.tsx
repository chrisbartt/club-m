"use client";
import React, { JSX, ReactNode } from "react";
import Sidebar from "@/components/layout/sidebar";
import { DrawerProvider } from "@/context/drawer-context";
import { DialogProvider } from "@/context/dialog-context";

const ChatContent = ({ children }: { children: ReactNode }) => {
  return (
    <div className="wrapper-page flex transition-300 flex-col lg:pl-[250px] min-h-screen w-full">
      {children}
    </div>
  );
};

function ChatContainer({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <DrawerProvider>
      <DialogProvider>
        <div className="global-div flex flex-col min-h-screen bg-bgFond">
          <Sidebar />
          <ChatContent>{children}</ChatContent>
        </div>
      </DialogProvider>
    </DrawerProvider>
  );
}

export default ChatContainer;
