"use client";
import React, { JSX } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ResponsiveMenu from "@/components/layout/responsive-menu";
import { DialogProvider } from "@/context/dialog-context";
import { DrawerProvider } from "@/context/drawer-context";
import { ImageModalProvider } from "@/context/image-modal-context";
import { MenuProvider } from "@/context/menu-context";
import { CartProvider } from "@/context/cart-context";
import ImageModal from "@/components/features/imageModal/imageModal";

const AppContainerWebSite = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <div className="global-div min-h-screen overflow-x-hidden lg:overflow-x-visible">
      <DrawerProvider>
        <DialogProvider>
          <ImageModalProvider>
            <MenuProvider>
              <CartProvider>
                <Navbar />
                <ResponsiveMenu />
                {children}
                <Footer />
                <ImageModal />
              </CartProvider>
            </MenuProvider>
          </ImageModalProvider>
        </DialogProvider>
      </DrawerProvider>
    </div>
  );
};

export default AppContainerWebSite;
