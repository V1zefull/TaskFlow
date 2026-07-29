import React, { useRef } from "react";
import style from "./TfTextarea.module.css";
import TfButton from "@/components/uikit/buttons/TfButton";
import iconCross from "@/assets/cross.svg";

const SIZE_CLASSES = {
  sm: style.tfTextareaSm,
  md: style.tfTextarea,
  lg: style.tfTextareaLg,
} as const;

export interface TfTextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "defaultValue" | "onChange"
> {
  ref?: React.Ref<HTMLTextAreaElement>;
  size?: "sm" | "md" | "lg";
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  clearable?: boolean;
  fullWidth?: boolean;
}

export default function TfTextarea({
  ref,
  size = "md",
  className,
  disabled = false,
  value,
  onChange,
  clearable = false,
  fullWidth = false,
  maxLength,
  ...rest
}: TfTextareaProps) {
  const sizeClass = SIZE_CLASSES[size];
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasValue = value.length > 0;
  const hasMaxLength = typeof maxLength === "number";
  const atLimit = hasMaxLength && value.length >= maxLength;
  const counterText = hasMaxLength
    ? `${value.length}/${maxLength}`
    : `${value.length}`;

  const setTextareaRef = (node: HTMLTextAreaElement | null) => {
    textareaRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const handleClear = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.value = "";
    onChange({
      target: textarea,
      currentTarget: textarea,
    } as React.ChangeEvent<HTMLTextAreaElement>);

    textarea.focus();
  };

  return (
    <div
      className={[
        style.tfTextareaWrapper,
        fullWidth && style.tfTextareaWrapperFull,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <textarea
        ref={setTextareaRef}
        placeholder={rest.placeholder}
        name={rest.name}
        id={rest.id}
        disabled={disabled}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={[
          sizeClass,
          fullWidth && style.tfTextareaFull,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
      <div className={style.tfTextareaFooter}>
        <span
          className={[
            style.tfTextareaCounter,
            atLimit ? style.tfTextareaCounterLimit : undefined,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {counterText}
        </span>
        {clearable && (
          <TfButton
            type="button"
            variant="ghost"
            size="sm"
            iconOnly
            disabled={disabled}
            className={!hasValue ? style.tfTextareaClearHidden : undefined}
            onClick={handleClear}
          >
            <img
              src={iconCross}
              alt=""
              width={16}
              height={16}
              className={style.tfTextareaClearIcon}
            />
          </TfButton>
        )}
      </div>
    </div>
  );
}
