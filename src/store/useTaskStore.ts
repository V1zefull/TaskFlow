import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreateTaskInput, Task, TaskStatus } from "@/types/task";

interface TaskStore {
  tasks: Task[];
  addTask: (input: CreateTaskInput) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],

      addTask: (input) =>
        set((state) => {
          const now = new Date().toISOString();

          const task: Task = {
            id: crypto.randomUUID(),
            title: input.title.trim(),
            description: input.description.trim(),
            urgency: input.urgency,
            status: "todo",
            createdAt: now,
            updatedAt: now,
          };

          return { tasks: [task, ...state.tasks] };
        }),

      updateTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status,
                  updatedAt: new Date().toISOString(),
                }
              : task,
          ),
        })),

      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: "taskflow-tasks",
      version: 1,
    },
  ),
);
