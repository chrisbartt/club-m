"use client";

import React from "react";
import { DialogProvider } from "@/context/dialog-context";
import FormCommencer from "./formCommencer";
import { ImageModalProvider } from "@/context/image-modal-context";
import ImageModal from "@/components/features/imageModal/imageModal";

const Container = () => {
  return (
    <div className="global-div min-h-screen overflow-x-hidden lg:overflow-x-visible">
      <DialogProvider>
        <ImageModalProvider>
          <FormCommencer />
          <ImageModal />
        </ImageModalProvider>
      </DialogProvider>
    </div>
  );
};

export default Container;
