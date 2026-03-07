"use client";
import React, { JSX } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/_layout/navbar/navbar";
import Footer from "@/components/_layout/footer/footer";
import ResponsiveMenu from "@/components/_layout/responsiveMenu/ResponsiveMenu";
import { DialogProvider } from "@/context/dialog/contextDialog";
import { ImageModalProvider } from "@/context/imgModalContext/imageModalContext";
import { MenuProvider } from "@/context/menuContext/menuContext";
import ImageModal from "@/components/features/imageModal/imageModal";

/**
 * ViewApp component that wraps its children with several context providers.
 * Si l’URL contient ?nochrome=1 (ex. aperçu cahier de contenus), la navbar et le footer ne sont pas affichés.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the ViewApp.
 * @returns {JSX.Element} The rendered component with context providers.
 */

const AppContainerWebSite = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const searchParams = useSearchParams();
  const noChrome = searchParams.get("nochrome") === "1";

  return (
    <div className="global-div min-h-screen overflow-x-hidden lg:overflow-x-visible">
      <DialogProvider>
        <ImageModalProvider>
          <MenuProvider>
            {!noChrome && <Navbar />}
            {!noChrome && <ResponsiveMenu />}
            {children}
            {!noChrome && <Footer />}
            <ImageModal />
          </MenuProvider>
        </ImageModalProvider>
      </DialogProvider>
    </div>
  );
};

export default AppContainerWebSite;
