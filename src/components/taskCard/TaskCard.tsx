import type { Task, TaskStatus, TaskUrgency } from "@/types/task";
import { useTaskStore } from "@/store/useTaskStore";
import TfSelect from "@/components/uikit/select/TfSelect";
import type { TfSelectOption } from "@/components/uikit/select/TfSelect";
import TfButton from "@/components/uikit/buttons/TfButton";
import styles from "./TaskCard.module.css";

interface TaskCardProps {
  task: Task;
}

const STATUS_OPTIONS: TfSelectOption[] = [
  { value: "todo", label: "Нужно сделать" },
  { value: "inProgress", label: "В работе" },
  { value: "done", label: "Готово" },
];

const URGENCY_LABELS: Record<TaskUrgency, string> = {
  low: "Низкая",
  medium: "Средняя",
  high: "Высокая",
  critical: "Критическая",
};

function isTaskStatus(value: string): value is TaskStatus {
  return value === "todo" || value === "inProgress" || value === "done";
}

export default function TaskCard({ task }: TaskCardProps) {
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const removeTask = useTaskStore((state) => state.removeTask);
  const handleStatusChange = (value: string) => {
    if (!isTaskStatus(value)) return;
    updateTaskStatus(task.id, value);
  };

  const handleRemove = () => {
    const confirmed = window.confirm(`Удалить задачу "${task.title}"?`);
    if (confirmed) {
      removeTask(task.id);
    }
  };
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>

        <span className={styles.urgency} data-urgency={task.urgency}>
          {URGENCY_LABELS[task.urgency]}
        </span>
      </div>

      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      <div className={styles.footer}>
        <div className={styles.statusControl}>
          <span className={styles.statusLabel}>Статус</span>

          <TfSelect
            options={STATUS_OPTIONS}
            value={task.status}
            onChange={handleStatusChange}
            size="sm"
            fullWidth
          />
        </div>

        <TfButton
          variant="ghost"
          size="sm"
          className={styles.deleteButton}
          onClick={handleRemove}
        >
          Удалить
        </TfButton>
      </div>
    </article>
  );
}
