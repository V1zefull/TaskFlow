import React from "react";
import style from "./TaskCardAddModal.module.css";

const SIZE_CLASSES = {
  sm: style.modalSm,
  md: style.modal,
  lg: style.modalLg,
} as const;

export interface TaskCardAddModalProps {
  ref?: React.Ref<HTMLElement>;
  size?: "sm" | "md" | "lg";
  headerName?: string;
}

export default function TaskCardAddModal({
  ref,
  size = "md",
  headerName = "Модальное окно",
}: TaskCardAddModalProps) {
  const sizeClass = SIZE_CLASSES[size];
  return (
    <div className="wrapper">
      <div className="container">
        <div className="headerName">{headerName}</div>
      </div>
    </div>
  );
}
