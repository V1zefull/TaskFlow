import { useState } from "react";
import "./App.css";
import Header from "@/components/header/Header";
import TfButton from "./components/uikit/buttons/TfButton";
import TfInput from "./components/uikit/inputs/TfInput";
import TfTextarea from "./components/uikit/inputs/textarea/TfTextarea";
import TaskCardAddModal from "./components/taskCard/modal/TaskCardAddModal";
import plusIcon from "@/assets/plus.svg";

function App() {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");

  const checkClick = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    setLoading(true);
  };

  return (
    <>
      <Header />
      <TaskCardAddModal/>
      {/* <TfButton onClick={checkClick} loading={loading} size="sm" iconOnly>
        <img
          src={plusIcon}
          alt="Добавить"
          width={20}
          height={20}
          className="icon-white"
        />
      </TfButton>
      <TfInput
        type="text"
        placeholder="Введите текст"
        clearable
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <TfTextarea
        size="md"
        maxLength={400}
        placeholder="Введите текст"
        clearable
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
      /> */}
    </>
  );
}

export default App;
