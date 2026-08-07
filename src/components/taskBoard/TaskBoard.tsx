import { useTaskStore } from "@/store/useTaskStore";
import TaskCard from "@/components/taskCard/TaskCard";
import styles from "./TaskBoard.module.css";

const COLUMNS = [
  { status: "todo", title: "Нужно сделать" },
  { status: "inProgress", title: "В работе" },
  { status: "done", title: "Готово" },
] as const;

export default function TaskBoard() {
  const tasks = useTaskStore((state) => state.tasks);
  return (
    <div>
      <section className={styles.board} aria-label="Доска задач">
        {COLUMNS.map((column) => {
          const colunmTasks = tasks.filter(
            (task) => task.status === column.status,
          );
          return (
            <section className={styles.column} key={column.status}>
              <div className={styles.columnHeader}>
                <h2 className={styles.columnTitle}>{column.title}</h2>
                <span className={styles.taskCount}>{colunmTasks.length}</span>
              </div>
              <div className={styles.taskList}>
                {colunmTasks.length > 0 ? (
                  colunmTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
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
