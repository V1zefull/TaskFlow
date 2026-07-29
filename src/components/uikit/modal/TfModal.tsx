import React, { useEffect } from "react";
import style from "./TfModal.module.css";
import { createPortal } from "react-dom";

const SIZE_CLASSES = {
  sm: style.modalSm,
  md: style.modal,
  lg: style.modalLg,
} as const;

export interface TfModalProps {
  size?: "sm" | "md" | "lg";
  headerName?: string;
  isOpen?: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  children?: React.ReactNode;
}

export default function TfModal({
  size = "md",
  headerName = "Модальное окно",
  isOpen = false,
  onClose,
  closeOnOverlayClick = true,
  children,
}: TfModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={style.overlay}
      onClick={() => closeOnOverlayClick && onClose?.()}
    >
      <div
        className={SIZE_CLASSES[size]}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={style.header}>{headerName}</div>
        <div className={style.body}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
