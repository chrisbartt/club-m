"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type ImageModalContextType = {
  selectedImage: string | null;
  images: string[];
  currentIndex: number;
  setSelectedImage: (imageSrc: string | null) => void;
  openModal: (imageSrc: string, images?: string[]) => void;
  closeModal: () => void;
  nextImage: () => void;
  previousImage: () => void;
};

const ImageModalContext = createContext<ImageModalContextType | undefined>(
  undefined
);

export const ImageModalProvider = ({ children }: { children: ReactNode }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const openModal = useCallback((imageSrc: string, imagesList?: string[]) => {
    if (imagesList && imagesList.length > 0) {
      setImages(imagesList);
      const index = imagesList.indexOf(imageSrc);
      setCurrentIndex(index >= 0 ? index : 0);
    } else {
      setImages([imageSrc]);
      setCurrentIndex(0);
    }
    setSelectedImage(imageSrc);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
    setImages([]);
    setCurrentIndex(0);
  }, []);

  const nextImage = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        setSelectedImage(images[nextIndex]);
        return nextIndex;
      });
    }
  }, [images]);

  const previousImage = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => {
        const prevIndexCalc = (prevIndex - 1 + images.length) % images.length;
        setSelectedImage(images[prevIndexCalc]);
        return prevIndexCalc;
      });
    }
  }, [images]);

  return (
    <ImageModalContext.Provider
      value={{
        selectedImage,
        images,
        currentIndex,
        setSelectedImage,
        openModal,
        closeModal,
        nextImage,
        previousImage,
      }}
    >
      {children}
    </ImageModalContext.Provider>
  );
};

export const useImageModal = () => {
  const context = useContext(ImageModalContext);
  if (!context)
    throw new Error("useImageModal must be used within ImageModalProvider");
  return context;
};
