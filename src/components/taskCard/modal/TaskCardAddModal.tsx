import { useState } from "react";
import style from "./TaskCardAddModal.module.css";
import TfModal from "@/components/uikit/modal/TfModal";
import TfInput from "@/components/uikit/inputs/TfInput";
import TfTextarea from "@/components/uikit/inputs/textarea/TfTextarea";
import TfButton from "@/components/uikit/buttons/TfButton";
import TfSelect from "@/components/uikit/select/TfSelect";
import type { TfSelectOption } from "@/components/uikit/select/TfSelect";
import type { CreateTaskInput, TaskUrgency } from "@/types/task";


const URGENCY_OPTIONS: TfSelectOption[] = [
  { value: "low", label: "Низкая" },
  { value: "medium", label: "Средняя" },
  { value: "high", label: "Высокая" },
  { value: "critical", label: "Критическая" },
];

export interface TaskCardAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput) => void;
}

export default function TaskCardAddModal({
  isOpen,
  onClose,
  onSubmit,
}: TaskCardAddModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<TaskUrgency>("medium");

  const canSubmit = title.trim().length > 0;

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setUrgency("medium");
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ title, description, urgency });
    handleClose();
  };

  return (
    <TfModal isOpen={isOpen} onClose={handleClose} headerName="Новая задача">
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
        <TfButton variant="secondary" onClick={handleClose}>
          Отмена
        </TfButton>
        <TfButton
          variant="primary"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Сохранить
        </TfButton>
      </div>
    </TfModal>
  );
}
