import { ButtonHTMLAttributes } from "react";

type SealButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function SealButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: SealButtonProps) {
  const base =
    "seal-focus rounded px-4 py-2 text-sm font-medium transition-shadow duration-200 disabled:cursor-not-allowed disabled:opacity-40";
  const styles =
    variant === "primary"
      ? "bg-seal/15 text-seal border border-seal/40 hover:shadow-seal-hover"
      : "border border-hairline text-paper hover:shadow-seal-hover bg-transparent";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
