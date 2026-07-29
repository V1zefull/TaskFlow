import React, { useRef, useState } from "react";
import style from "./TfInput.module.css";
import TfButton from "@/components/uikit/buttons/TfButton";
import iconCross from "@/assets/cross.svg";
import iconEyeOpened from "@/assets/eye.svg";
import iconEyeClosed from "@/assets/eye-closed.svg";

const SIZE_CLASSES = {
  sm: style.tfInputSm,
  md: style.tfInput,
  lg: style.tfInputLg,
} as const;

const WRAPPER_SIZE_CLASSES = {
  sm: style.tfInputWrapperSm,
  md: style.tfInputWrapperMd,
  lg: style.tfInputWrapperLg,
} as const;

export interface TfInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange"
> {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  ref?: React.Ref<HTMLInputElement>;
  uiSize?: "sm" | "md" | "lg";
  /**
   * Показывать кнопку очистки, когда в поле есть значение.
   *
   * Не действует при `type="password"`: там место справа занято переключателем
   * видимости, и две иконки подряд в поле не помещаются. Проп в этом случае
   * молча игнорируется — это ожидаемое поведение, а не недосмотр.
   */
  clearable?: boolean;
  fullWidth?: boolean;
}

function TfInput({
  className,
  clearable = false,
  uiSize = "md",
  type = "text",
  value,
  onChange,
  disabled = false,
  fullWidth = false,
  ref,
  ...rest
}: TfInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const sizeClass = SIZE_CLASSES[uiSize];
  const wrapperSizeClass = WRAPPER_SIZE_CLASSES[uiSize];
  const isPassword = type === "password";
  const resolvedType = isPassword && passwordVisible ? "text" : type;
  const inputRef = useRef<HTMLInputElement>(null);

  const hasValue = value.length > 0;

  const handleClear = () => {
    const input = inputRef.current;
    if (!input) return;
    input.value = "";
    onChange({
      target: input,
      currentTarget: input,
    } as React.ChangeEvent<HTMLInputElement>);

    input.focus();
  };

  const setInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <div
      className={[wrapperSizeClass, fullWidth && style.tfInputWrapperFull]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        ref={setInputRef}
        type={resolvedType}
        placeholder={rest.placeholder}
        className={[sizeClass, className].filter(Boolean).join(" ")}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...rest}
      />
      {clearable && !isPassword && (
        <TfButton
          type="button"
          variant="ghost"
          size="sm"
          iconOnly
          aria-label="Очистить поле"
          disabled={disabled}
          className={!hasValue ? style.tfInputIconHidden : undefined}
          onClick={handleClear}
        >
          <img
            src={iconCross}
            alt=""
            width={16}
            height={16}
            className={style.tfInputIcon}
          />
        </TfButton>
      )}
      {isPassword && (
        <TfButton
          type="button"
          variant="ghost"
          size="sm"
          iconOnly
          aria-label={passwordVisible ? "Скрыть пароль" : "Показать пароль"}
          disabled={disabled}
          onClick={() => setPasswordVisible((visible) => !visible)}
        >
          <img
            src={passwordVisible ? iconEyeOpened : iconEyeClosed}
            alt=""
            width={16}
            height={16}
            className={style.tfInputIcon}
          />
        </TfButton>
      )}
    </div>
  );
}

export default TfInput;
