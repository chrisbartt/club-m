"use client";

import AppContainerWebSite from "@/components/common/containers/AppContainerWebSite";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppContainerWebSite>
      {children}
    </AppContainerWebSite>
  );
}
