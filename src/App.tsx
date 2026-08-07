import { useState } from "react";
import "./App.css";
import Header from "@/components/header/Header";
import TaskCardAddModal from "@/components/taskCard/modal/TaskCardAddModal";
import { useTaskStore } from "./store/useTaskStore";
import TaskBoard from "./components/taskBoard/TaskBoard";

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const addTask = useTaskStore((state) => state.addTask);
  return (
    <>
      <Header onAddTaskClick={() => setIsAddModalOpen(true)} />
      <main>
        <TaskBoard />
      </main>
      <TaskCardAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addTask}
      />
    </>
  );
}

export default App;
