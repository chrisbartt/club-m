import { createContext, ReactNode, useContext, useState } from "react";

type DrawerState = Record<string, boolean>;
type DrawerData = Record<string, unknown>;

type DrawerContextType = {
  openDrawer: (drawerName: string, data?: unknown) => void;
  closeDrawer: (drawerName: string) => void;
  isDrawerOpen: (drawerName: string) => boolean;
  getDrawerData: (drawerName: string) => unknown;
};

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [drawers, setDrawers] = useState<DrawerState>({});
  const [drawerData, setDrawerData] = useState<DrawerData>({});

  const openDrawer = (drawerName: string, data?: unknown) => {
    setDrawers((prev) => ({ ...prev, [drawerName]: true }));
    if (data) {
      setDrawerData((prev) => ({ ...prev, [drawerName]: data }));
    }
  };

  const closeDrawer = (drawerName: string) => {
    setDrawers((prev) => ({ ...prev, [drawerName]: false }));
    setDrawerData((prev) => {
      const newData = { ...prev };
      delete newData[drawerName];
      return newData;
    });
  };

  const isDrawerOpen = (drawerName: string) => !!drawers[drawerName];
  const getDrawerData = (drawerName: string) => drawerData[drawerName];

  return (
    <DrawerContext.Provider
      value={{ openDrawer, closeDrawer, isDrawerOpen, getDrawerData }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer doit être utilisé dans un DrawerProvider");
  }
  return context;
};
