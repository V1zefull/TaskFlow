import { useState } from "react";
import style from "./TaskFormModal.module.css";
import TfModal from "@/components/uikit/modal/TfModal";
import TfInput from "@/components/uikit/inputs/TfInput";
import TfTextarea from "@/components/uikit/inputs/textarea/TfTextarea";
import TfButton from "@/components/uikit/buttons/TfButton";
import TfSelect from "@/components/uikit/select/TfSelect";
import type { TfSelectOption } from "@/components/uikit/select/TfSelect";
import type { TaskFormValue, TaskUrgency } from "@/types/task";

const URGENCY_OPTIONS: TfSelectOption[] = [
  { value: "low", label: "Низкая" },
  { value: "medium", label: "Средняя" },
  { value: "high", label: "Высокая" },
  { value: "critical", label: "Критическая" },
];

function isTaskUrgency(value: string): value is TaskUrgency {
  return (
    value === "low" ||
    value === "medium" ||
    value === "high" ||
    value === "critical"
  );
}

export interface TaskFormModalProps {
  value?: TaskFormValue;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormValue) => void;
  mode?: "create" | "edit";
}

export default function TaskFormModal({
  value,
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
}: TaskFormModalProps) {
  const [title, setTitle] = useState(value?.title ?? "");
  const [description, setDescription] = useState(value?.description ?? "");
  const [urgency, setUrgency] = useState<TaskUrgency>(
    value?.urgency ?? "medium",
  );

  const canSubmit = title.trim().length > 0;

  const handleClose = () => {
    onClose();
  };

  const handleUrgencyChange = (nextUrgency: string) => {
    if (isTaskUrgency(nextUrgency)) {
      setUrgency(nextUrgency);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ title, description, urgency });
    handleClose();
  };

  return (
    <TfModal
      isOpen={isOpen}
      onClose={handleClose}
      headerName={mode === "create" ? "Новая задача" : "Редактирование задачи"}
    >
      <div className={style.field}>
        <label className={style.label} htmlFor="taskFormModalTitle">
          Название
        </label>
        <TfInput
          id="taskFormModalTitle"
          placeholder="Введите название задачи"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          clearable
          fullWidth
        />
      </div>
      <div className={style.field}>
        <label className={style.label} htmlFor="taskFormModalDescription">
          Описание
        </label>
        <TfTextarea
          id="taskFormModalDescription"
          placeholder="Введите описание задачи"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          clearable
          fullWidth
        />
      </div>
      <div className={style.field}>
        <label className={style.label} htmlFor="taskFormModalUrgency">
          Срочность
        </label>
        <TfSelect
          id="taskFormModalUrgency"
          options={URGENCY_OPTIONS}
          value={urgency}
          onChange={handleUrgencyChange}
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
          {mode === "create" ? "Создать" : "Сохранить"}
        </TfButton>
      </div>
    </TfModal>
  );
}
