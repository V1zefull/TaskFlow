import { useEffect, useState } from "react";
import style from "./TaskCardAddModal.module.css";
import TfModal from "@/components/uikit/modal/TfModal";
import TfInput from "@/components/uikit/inputs/TfInput";
import TfTextarea from "@/components/uikit/inputs/textarea/TfTextarea";
import TfButton from "@/components/uikit/buttons/TfButton";
import TfSelect from "@/components/uikit/select/TfSelect";
import type { TfSelectOption } from "@/components/uikit/select/TfSelect";

export type TaskUrgency = "0" | "1" | "2" | "3";

const URGENCY_OPTIONS: TfSelectOption[] = [
  { value: "0", label: "Низкая" },
  { value: "1", label: "Средняя" },
  { value: "2", label: "Высокая" },
  { value: "3", label: "Критическая" },
];

export interface TaskCardAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    urgency: TaskUrgency;
  }) => void;
}

export default function TaskCardAddModal({
  isOpen,
  onClose,
  onSubmit,
}: TaskCardAddModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<TaskUrgency>("1");

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setUrgency("1");
    }
  }, [isOpen]);

  const canSubmit = title.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ title, description, urgency });
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
          fullWidth
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
          fullWidth
        />
      </div>
      <div className={style.field}>
        <label className={style.label} htmlFor="taskCardAddModalUrgency">
          Срочность
        </label>
        <TfSelect
          id="taskCardAddModalUrgency"
          options={URGENCY_OPTIONS}
          value={urgency}
          onChange={(value) => setUrgency(value as TaskUrgency)}
          fullWidth
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
