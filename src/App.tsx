import { useState } from "react";
import "./App.css";
import Header from "@/components/header/Header";
import TaskFormModal from "@/components/taskCard/modal/TaskFormModal";
import TaskBoard from "@/components/taskBoard/TaskBoard";
import { useTaskStore } from "@/store/useTaskStore";
import type { TaskFormValue } from "@/types/task";

function App() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const editingTask = editingTaskId
    ? tasks.find((task) => task.id === editingTaskId)
    : undefined;

  const handleCreateTask = () => {
    setEditingTaskId(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTaskId(null);
  };

  const handleSubmitTask = (value: TaskFormValue) => {
    if (editingTaskId) {
      updateTask(editingTaskId, value);
      return;
    }

    addTask(value);
  };

  return (
    <>
      <Header onAddTaskClick={handleCreateTask} />
      <main>
        <TaskBoard onEditTask={handleEditTask} />
      </main>
      {isTaskModalOpen && (
        <TaskFormModal
          key={editingTaskId ?? "create"}
          isOpen
          mode={editingTask ? "edit" : "create"}
          value={editingTask}
          onClose={handleCloseTaskModal}
          onSubmit={handleSubmitTask}
        />
      )}
    </>
  );
}

export default App;
