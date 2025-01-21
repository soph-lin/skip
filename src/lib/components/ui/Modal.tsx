import React, { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";

export interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({
  isOpen = true,
  onClose,
  children,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm border border-foreground"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
