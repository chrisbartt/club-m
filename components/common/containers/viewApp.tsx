"use client";
import React, { JSX } from "react";
import { DrawerProvider } from "@/context/drawer-context";
import { DialogProvider } from "@/context/dialog-context";

/**
 * ViewApp component that wraps its children with several context providers.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the ViewApp.
 * @returns {JSX.Element} The rendered component with context providers.
 *
 * The component includes the following providers:
 * - ClientOnly: Ensures the children are only rendered on the client side.
 * - LoadingProvider: Provides loading state management.
 * - DrawerProvider: Manages the state of a drawer component.
 * - ModalProvider: Manages the state of modal components.
 *
 * Additionally, the component includes:
 * - A main container with specific styling classes.
 * - ToastMain: A component for displaying toast notifications.
 * - OverlayWaiting: A component for displaying an overlay while waiting.
 */

const ViewApp = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <DrawerProvider>
      <DialogProvider>
        <div className="global-div min-h-screen">
          {children}
        </div>
      </DialogProvider>
    </DrawerProvider>
  );
};

export default ViewApp;
