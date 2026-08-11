import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import style from "./TfSelect.module.css";
import iconChevron from "@/assets/chevron-down.svg";

const WRAPPER_SIZE_CLASSES = {
  sm: style.tfSelectWrapperSm,
  md: style.tfSelectWrapperMd,
  lg: style.tfSelectWrapperLg,
} as const;

const SIZE_CLASSES = {
  sm: style.tfSelectSm,
  md: style.tfSelect,
  lg: style.tfSelectLg,
} as const;

export type TfSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface TfSelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  options: TfSelectOption[];
  value: string;
  onChange: (value: string) => void;
  ref?: React.Ref<HTMLButtonElement>;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

function findEnabledIndex(
  options: TfSelectOption[],
  from: number,
  step: number,
): number {
  for (let i = from; i >= 0 && i < options.length; i += step) {
    if (!options[i].disabled) return i;
  }
  return -1;
}

export default function TfSelect({
  className,
  options,
  value,
  onChange,
  ref,
  size = "md",
  placeholder = "Выберите значение",
  disabled = false,
  fullWidth = false,
  ...rest
}: TfSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [listPosition, setListPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const listboxId = useId();
  const wrapperSizeClass = WRAPPER_SIZE_CLASSES[size];
  const sizeClass = SIZE_CLASSES[size];

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption =
    selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const setTriggerRef = (node: HTMLButtonElement | null) => {
    triggerRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const openList = () => {
    if (disabled) return;
    const start =
      selectedIndex >= 0 && !options[selectedIndex].disabled
        ? selectedIndex
        : findEnabledIndex(options, 0, 1);
    setActiveIndex(start);
    setOpen(true);
  };

  const closeList = ({ focusTrigger = true } = {}) => {
    setOpen(false);
    setActiveIndex(-1);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const selectIndex = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    closeList();
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      setOpen(false);
      setActiveIndex(-1);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const updateListPosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setListPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };

    updateListPosition();
    window.addEventListener("scroll", updateListPosition, true);
    window.addEventListener("resize", updateListPosition);
    return () => {
      window.removeEventListener("scroll", updateListPosition, true);
      window.removeEventListener("resize", updateListPosition);
    };
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [open, activeIndex]);

  return (
    <div
      ref={rootRef}
      className={[
        wrapperSizeClass,
        fullWidth && style.tfSelectWrapperFull,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <button
        ref={setTriggerRef}
        type="button"
        disabled={disabled}
        className={[sizeClass, open && style.tfSelectOpen]
          .filter(Boolean)
          .join(" ")}
        onClick={() => (open ? closeList() : openList())}
      >
        <span
          className={
            selectedOption ? style.tfSelectValue : style.tfSelectPlaceholder
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <img
          src={iconChevron}
          alt=""
          width={16}
          height={16}
          className={[style.tfSelectChevron, open && style.tfSelectChevronOpen]
            .filter(Boolean)
            .join(" ")}
        />
      </button>

      {open &&
        !disabled &&
        listPosition &&
        createPortal(
          <ul
            ref={listRef}
            id={listboxId}
            className={style.tfSelectListbox}
            style={{
              position: "fixed",
              top: listPosition.top,
              left: listPosition.left,
              width: listPosition.width,
            }}
            onMouseDown={(event) => event.preventDefault()}
          >
            {options.length === 0 && (
              <li className={style.tfSelectEmpty}>Вариантов нет</li>
            )}
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${listboxId}-option-${index}`}
                className={[
                  style.tfSelectOption,
                  index === activeIndex && style.tfSelectOptionActive,
                  option.value === value && style.tfSelectOptionSelected,
                  option.disabled && style.tfSelectOptionDisabled,
                ]
                  .filter(Boolean)
                  .join(" ")}
                onMouseEnter={() => {
                  if (!option.disabled) setActiveIndex(index);
                }}
                onClick={() => selectIndex(index)}
              >
                {option.label}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
