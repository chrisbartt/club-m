"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DialogContextType {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  setTitle: (value: string) => void;
  content: ReactNode;
  setContent: (value: ReactNode) => void;
  // Nouvelles méthodes pour gérer les dialogs par nom
  isDialogOpen: (dialogName: string) => boolean;
  openDialog: (dialogName: string, data?: unknown) => void;
  closeDialog: (dialogName: string) => void;
  getDialogData: (dialogName: string) => unknown | undefined;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<ReactNode>(null);
  const [openDialogs, setOpenDialogs] = useState<Set<string>>(new Set());
  const [dialogData, setDialogData] = useState<Map<string, unknown>>(new Map());

  const isDialogOpen = (dialogName: string): boolean => {
    return openDialogs.has(dialogName);
  };

  const openDialog = (dialogName: string, data?: unknown): void => {
    setOpenDialogs(prev => new Set(prev).add(dialogName));
    if (data !== undefined) {
      setDialogData(prev => new Map(prev).set(dialogName, data));
    }
  };

  const closeDialog = (dialogName: string): void => {
    setOpenDialogs(prev => {
      const newSet = new Set(prev);
      newSet.delete(dialogName);
      return newSet;
    });
    setDialogData(prev => {
      const newMap = new Map(prev);
      newMap.delete(dialogName);
      return newMap;
    });
  };

  const getDialogData = (dialogName: string): unknown | undefined => {
    return dialogData.get(dialogName);
  };

  return (
    <DialogContext.Provider value={{ 
      isOpen, 
      setIsOpen, 
      title, 
      setTitle, 
      content, 
      setContent,
      isDialogOpen,
      openDialog,
      closeDialog,
      getDialogData
    }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
