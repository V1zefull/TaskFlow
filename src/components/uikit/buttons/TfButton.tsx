import React from "react";
import style from "./TfButton.module.css";

const SIZE_CLASSES = {
  sm: style.tfButtonSm,
  md: style.tfButton,
  lg: style.tfButtonLg,
} as const;

const ICON_ONLY_SIZE_CLASSES = {
  sm: style.tfButtonIconOnlySm,
  md: style.tfButtonIconOnlyMd,
  lg: style.tfButtonIconOnlyLg,
} as const;

const VARIANT_CLASSES = {
  primary: style.tfButtonPrimary,
  secondary: style.tfButtonSecondary,
  ghost: style.tfButtonGhost,
} as const;

export interface TfButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  iconOnly?: boolean;
}

function TfButton({
  ref,
  size = "md",
  variant = "primary",
  loading = false,
  iconOnly = false,
  className,
  type = "button",
  disabled = false,
  children,
  ...rest
}: TfButtonProps) {
  const sizeClass = SIZE_CLASSES[size];
  const iconOnlyClass = iconOnly ? ICON_ONLY_SIZE_CLASSES[size] : undefined;
  const variantClass = VARIANT_CLASSES[variant];

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={[
        sizeClass,
        iconOnlyClass,
        variantClass,
        loading && style.tfButtonLoading,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <span className={loading ? style.tfButtonContent : undefined}>
        {children}
      </span>
      {loading && <span className={style.tfButtonSpinner} />}
    </button>
  );
}

export default TfButton;
