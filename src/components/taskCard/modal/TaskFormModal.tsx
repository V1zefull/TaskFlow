import { useState } from "react";
import type { FormEvent } from "react";
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

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 1000;

function validateTitle(title: string): string | undefined {
  if (title.length === 0) return "Введите название задачи";
  if (title.trim().length === 0) {
    return "Название не может состоять только из пробелов";
  }
  if (title.length > TITLE_MAX_LENGTH) {
    return `Название не должно превышать ${TITLE_MAX_LENGTH} символов`;
  }
  return undefined;
}

function validateDescription(description: string): string | undefined {
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return `Описание не должно превышать ${DESCRIPTION_MAX_LENGTH} символов`;
  }
  return undefined;
}

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
  const [titleTouched, setTitleTouched] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const titleError = validateTitle(title);
  const descriptionError = validateDescription(description);
  const visibleTitleError =
    titleTouched || submitAttempted ? titleError : undefined;
  const visibleDescriptionError =
    descriptionTouched || submitAttempted ? descriptionError : undefined;
  const canSubmit = !titleError && !descriptionError;
  const isDirty =
    title !== (value?.title ?? "") ||
    description !== (value?.description ?? "") ||
    urgency !== (value?.urgency ?? "medium");

  const handleRequestClose = () => {
    if (
      !isDirty ||
      window.confirm("Закрыть форму? Несохранённые изменения будут потеряны.")
    ) {
      onClose();
    }
  };

  const handleUrgencyChange = (nextUrgency: string) => {
    if (isTaskUrgency(nextUrgency)) {
      setUrgency(nextUrgency);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      urgency,
    });
    onClose();
  };

  return (
    <TfModal
      isOpen={isOpen}
      onClose={handleRequestClose}
      headerName={mode === "create" ? "Новая задача" : "Редактирование задачи"}
    >
      <form className={style.form} noValidate onSubmit={handleSubmit}>
        <div className={style.field}>
          <label className={style.label} htmlFor="taskFormModalTitle">
            Название
          </label>
          <TfInput
            id="taskFormModalTitle"
            placeholder="Введите название задачи"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => setTitleTouched(true)}
            maxLength={TITLE_MAX_LENGTH}
            invalid={Boolean(visibleTitleError)}
            autoFocus
            clearable
            fullWidth
          />
          {visibleTitleError && (
            <p className={style.error} role="alert">
              {visibleTitleError}
            </p>
          )}
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor="taskFormModalDescription">
            Описание
          </label>
          <TfTextarea
            id="taskFormModalDescription"
            placeholder="Введите описание задачи"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            onBlur={() => setDescriptionTouched(true)}
            maxLength={DESCRIPTION_MAX_LENGTH}
            invalid={Boolean(visibleDescriptionError)}
            clearable
            fullWidth
          />
          {visibleDescriptionError && (
            <p className={style.error} role="alert">
              {visibleDescriptionError}
            </p>
          )}
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
          <TfButton variant="secondary" onClick={handleRequestClose}>
            Отмена
          </TfButton>
          <TfButton variant="primary" type="submit" disabled={!canSubmit}>
            {mode === "create" ? "Создать" : "Сохранить"}
          </TfButton>
        </div>
      </form>
    </TfModal>
  );
}
