import { useEffect, useState } from "react";
import style from "./TaskCardAddModal.module.css";
import TfModal from "@/components/uikit/modal/TfModal";
import TfInput from "@/components/uikit/inputs/TfInput";
import TfTextarea from "@/components/uikit/inputs/textarea/TfTextarea";
import TfButton from "@/components/uikit/buttons/TfButton";

export interface TaskCardAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => void;
}

export default function TaskCardAddModal({
  isOpen,
  onClose,
  onSubmit,
}: TaskCardAddModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
    }
  }, [isOpen]);

  const canSubmit = title.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ title, description });
    onClose();
  };

  return (
    <TfModal isOpen={isOpen} onClose={onClose} headerName="Новая задача">
      <div className={style.field}>
        <label className={style.label} htmlFor="taskCardAddModalTitle">
          Название
        </label>
        <TfInput
          id="taskCardAddModalTitle"
          placeholder="Введите название задачи"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          clearable
        />
      </div>
      <div className={style.field}>
        <label className={style.label} htmlFor="taskCardAddModalDescription">
          Описание
        </label>
        <TfTextarea
          id="taskCardAddModalDescription"
          placeholder="Введите описание задачи"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          clearable
        />
      </div>
      <div className={style.footer}>
        <TfButton variant="secondary" onClick={onClose}>
          Отмена
        </TfButton>
        <TfButton variant="primary" disabled={!canSubmit} onClick={handleSubmit}>
          Сохранить
        </TfButton>
      </div>
    </TfModal>
  );
}
