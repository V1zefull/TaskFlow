import { useTaskStore } from "@/store/useTaskStore";
import TaskCard from "@/components/taskCard/TaskCard";
import styles from "./TaskBoard.module.css";

const COLUMNS = [
  { status: "todo", title: "Нужно сделать" },
  { status: "inProgress", title: "В работе" },
  { status: "done", title: "Готово" },
] as const;

interface TaskBoardProps {
  onEditTask: (taskId: string) => void;
}

export default function TaskBoard({ onEditTask }: TaskBoardProps) {
  const tasks = useTaskStore((state) => state.tasks);
  return (
    <div>
      <section className={styles.board} aria-label="Доска задач">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.status,
          );
          return (
            <section className={styles.column} key={column.status}>
              <div className={styles.columnHeader}>
                <h2 className={styles.columnTitle}>{column.title}</h2>
                <span className={styles.taskCount}>{columnTasks.length}</span>
              </div>
              <div className={styles.taskList}>
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => onEditTask(task.id)}
                    />
                  ))
                ) : (
                  <p className={styles.empty}>Задач пока нет</p>
                )}
              </div>
            </section>
          );
        })}
      </section>
    </div>
  );
}
