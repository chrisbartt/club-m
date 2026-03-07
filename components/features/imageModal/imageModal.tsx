"use client";
import { useImageModal } from "@/context/imgModalContext/imageModalContext";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";

const ImageModal = () => {
  const {
    selectedImage,
    images,
    currentIndex,
    closeModal,
    nextImage,
    previousImage,
  } = useImageModal();

  

  // Gérer la navigation au clavier
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        previousImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, nextImage, previousImage, closeModal]);

  if (!selectedImage) return null;

  const hasMultipleImages = images.length > 1;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 overflow-hidden"
      onClick={closeModal}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div className="relative max-w-7xl max-h-full w-full">
        {/* Bouton fermer */}
        <button
          onClick={closeModal}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 cursor-pointer"
          aria-label="Fermer le modal"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Bouton précédent */}
        {hasMultipleImages && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              previousImage();
            }}
            className="absolute left-4 cursor-pointer backdrop-blur-sm top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2 hover:bg-black/70"
            aria-label="Image précédente"
          >
            <ChevronLeft className="md:w-8 md:h-8 w-6 h-6" />
          </button>
        )}

        {/* Image */}
        <img
          src={selectedImage}
          alt=""
          className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Bouton suivant */}
        {hasMultipleImages && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 cursor-pointer backdrop-blur-sm top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2 hover:bg-black/70"
            aria-label="Image suivante"
          >
            <ChevronRight className="md:w-8 md:h-8 w-6 h-6" />
          </button>
        )}

        {/* Compteur d'images */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
