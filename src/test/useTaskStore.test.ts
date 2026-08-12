import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTaskStore } from "@/store/useTaskStore";
import type { TaskFormValue } from "@/types/task";

const DEFAULT_TASK: TaskFormValue = {
  title: "Первая задача",
  description: "Описание",
  urgency: "medium",
};

function addTask(input: TaskFormValue = DEFAULT_TASK) {
  useTaskStore.getState().addTask(input);
  return useTaskStore.getState().tasks[0];
}

describe("useTaskStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useTaskStore.setState({ tasks: [] });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-12T10:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("добавляет новую задачу", () => {
    addTask();

    const tasks = useTaskStore.getState().tasks;

    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      ...DEFAULT_TASK,
      status: "todo",
      createdAt: "2026-08-12T10:00:00.000Z",
      updatedAt: "2026-08-12T10:00:00.000Z",
    });
    expect(tasks[0].id).toEqual(expect.any(String));
  });

  it("обрезает пробелы в названии и описании новой задачи", () => {
    addTask({
      title: "  Задача с пробелами  ",
      description: "  Описание с пробелами  ",
      urgency: "medium",
    });

    const task = useTaskStore.getState().tasks[0];

    expect(task).toMatchObject({
      title: "Задача с пробелами",
      description: "Описание с пробелами",
    });
  });

  it("добавляет новые задачи в начало списка", () => {
    addTask({ ...DEFAULT_TASK, title: "Первая" });
    addTask({ ...DEFAULT_TASK, title: "Вторая" });

    expect(useTaskStore.getState().tasks.map((task) => task.title)).toEqual([
      "Вторая",
      "Первая",
    ]);
  });

  it("редактирует поля задачи и сохраняет её служебные данные", () => {
    const createdTask = addTask();

    useTaskStore.getState().updateTaskStatus(createdTask.id, "inProgress");
    const taskBeforeEdit = useTaskStore.getState().tasks[0];

    vi.setSystemTime(new Date("2026-08-12T11:00:00.000Z"));
    useTaskStore.getState().updateTask(createdTask.id, {
      title: "  Изменённая задача  ",
      description: "  Новое описание  ",
      urgency: "critical",
    });

    const updatedTask = useTaskStore.getState().tasks[0];

    expect(updatedTask).toMatchObject({
      title: "Изменённая задача",
      description: "Новое описание",
      urgency: "critical",
      updatedAt: "2026-08-12T11:00:00.000Z",
    });
    expect(updatedTask.id).toBe(taskBeforeEdit.id);
    expect(updatedTask.status).toBe("inProgress");
    expect(updatedTask.createdAt).toBe(taskBeforeEdit.createdAt);
  });

  it("не изменяет задачи при редактировании неизвестного id", () => {
    addTask();
    const tasksBeforeUpdate = useTaskStore.getState().tasks;

    useTaskStore.getState().updateTask("unknown-id", {
      title: "Другая задача",
      description: "Другое описание",
      urgency: "high",
    });

    expect(useTaskStore.getState().tasks).toEqual(tasksBeforeUpdate);
  });

  it("изменяет статус и дату обновления задачи", () => {
    const task = addTask();
    vi.setSystemTime(new Date("2026-08-12T12:00:00.000Z"));

    useTaskStore.getState().updateTaskStatus(task.id, "done");

    expect(useTaskStore.getState().tasks[0]).toMatchObject({
      status: "done",
      createdAt: "2026-08-12T10:00:00.000Z",
      updatedAt: "2026-08-12T12:00:00.000Z",
    });
  });

  it("удаляет задачу по id", () => {
    const firstTask = addTask({ ...DEFAULT_TASK, title: "Первая" });
    addTask({ ...DEFAULT_TASK, title: "Вторая" });

    useTaskStore.getState().removeTask(firstTask.id);

    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("Вторая");
  });

  it("сохраняет состояние в localStorage", () => {
    addTask();

    const persistedValue = localStorage.getItem("taskflow-tasks");

    expect(persistedValue).not.toBeNull();
    expect(JSON.parse(persistedValue ?? "{}")).toMatchObject({
      state: {
        tasks: [
          {
            ...DEFAULT_TASK,
            status: "todo",
          },
        ],
      },
      version: 1,
    });
  });
});
