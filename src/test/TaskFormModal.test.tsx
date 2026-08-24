import TaskFormModal from "@/components/taskCard/modal/TaskFormModal";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("TaskFormModal", () => {
  // Пустая форма + проверка кнопки "Создать"
  it("показывает пустую форму создания", () => {
    render(<TaskFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.getByLabelText("Название")).toHaveValue("");
    expect(screen.getByLabelText("Описание")).toHaveValue("");

    expect(screen.getByRole("button", { name: "Создать" })).toBeDisabled();
  });
  // Открытие задачи
  it("форма показывает текущие значения задачи", () => {
    render(
      <TaskFormModal
        isOpen
        mode="edit"
        value={{
          title: "Текущая задача",
          description: "Текущее описание",
          urgency: "high",
        }}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("Название")).toHaveValue("Текущая задача");
    expect(screen.getByLabelText("Описание")).toHaveValue("Текущее описание");
  });
  // Создание задачи
  it("отправляет заполненную форму", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TaskFormModal isOpen onClose={vi.fn()} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Название"), "Новая задача");
    await user.type(screen.getByLabelText("Описание"), "Описание задачи");
    await user.click(screen.getByRole("button", { name: "Создать" }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Новая задача",
      description: "Описание задачи",
      urgency: "medium",
    });
  });
  // Валидация
  it("показывает ошибку для названия из пробелов", async () => {
    const user = userEvent.setup();

    render(<TaskFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />);

    const titleInput = screen.getByLabelText("Название");

    await user.type(titleInput, "   ");
    await user.tab();

    expect(
      screen.getByText("Название не может состоять только из пробелов"),
    ).toBeInTheDocument();
  });
  // Предупреждения о несохраненных
  it("предупреждает о несохранённых изменениях", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<TaskFormModal isOpen onClose={onClose} onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText("Название"), "Изменение");

    await user.click(screen.getByRole("button", { name: "Отмена" }));

    expect(confirmMock).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
  });
});
