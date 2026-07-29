import React, { useEffect, useId, useRef, useState } from "react";
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

const TYPEAHEAD_RESET_MS = 500;

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
  ...rest
}: TfSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ query: "", at: 0 });

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

  const moveActive = (step: number) => {
    const from =
      activeIndex < 0
        ? step > 0
          ? 0
          : options.length - 1
        : activeIndex + step;
    const next = findEnabledIndex(options, from, step);
    if (next >= 0) setActiveIndex(next);
  };

  const handleTypeahead = (key: string) => {
    const now = Date.now();
    const expired = now - typeahead.current.at > TYPEAHEAD_RESET_MS;
    const query = expired
      ? key.toLowerCase()
      : typeahead.current.query + key.toLowerCase();
    typeahead.current = { query, at: now };

    const match = options.findIndex(
      (option) =>
        !option.disabled && option.label.toLowerCase().startsWith(query),
    );
    if (match < 0) return;

    if (open) setActiveIndex(match);
    else onChange(options[match].value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (open) moveActive(1);
        else openList();
        return;
      case "ArrowUp":
        event.preventDefault();
        if (open) moveActive(-1);
        else openList();
        return;
      case "Home": {
        if (!open) return;
        event.preventDefault();
        const first = findEnabledIndex(options, 0, 1);
        if (first >= 0) setActiveIndex(first);
        return;
      }
      case "End": {
        if (!open) return;
        event.preventDefault();
        const last = findEnabledIndex(options, options.length - 1, -1);
        if (last >= 0) setActiveIndex(last);
        return;
      }
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) selectIndex(activeIndex);
        else openList();
        return;
      case "Escape":
        if (!open) return;
        event.preventDefault();
        closeList();
        return;
      case "Tab":
        if (open) closeList({ focusTrigger: false });
        return;
      default:
        break;
    }

    if (
      event.key.length === 1 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey
    ) {
      handleTypeahead(event.key);
    }
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
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
      className={[wrapperSizeClass, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <button
        ref={setTriggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={
          open && activeIndex >= 0
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        disabled={disabled}
        className={[sizeClass, open && style.tfSelectOpen]
          .filter(Boolean)
          .join(" ")}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={handleKeyDown}
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

      {open && !disabled && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className={style.tfSelectListbox}
          onMouseDown={(event) => event.preventDefault()}
        >
          {options.length === 0 && (
            <li className={style.tfSelectEmpty}>Вариантов нет</li>
          )}
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
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
        </ul>
      )}
    </div>
  );
}
