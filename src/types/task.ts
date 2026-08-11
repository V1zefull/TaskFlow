export type TaskStatus = "todo" | "inProgress" | "done";

export type TaskUrgency = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  title: string;
  description: string;
  urgency: TaskUrgency;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export type TaskFormValue = Pick<Task, "title" | "description" | "urgency">;
