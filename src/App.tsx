import { useState } from "react";
import "./App.css";
import Header from "@/components/header/Header";
import TaskCardAddModal from "@/components/taskCard/modal/TaskCardAddModal";

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <Header onAddTaskClick={() => setIsAddModalOpen(true)} />
      <TaskCardAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data) => {
          console.log(data);
          setIsAddModalOpen(false);
        }}
      />
    </>
  );
}

export default App;
