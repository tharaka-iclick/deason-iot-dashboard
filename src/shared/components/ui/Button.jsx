import React from "react";
import { Loader2 } from "lucide-react";
import "./Button.css";

export const Button = ({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  icon: Icon,
  fullWidth = false,
  ...props
}) => {
  const className = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && "btn-full-width",
    (loading || disabled) && "btn-disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={className} disabled={loading || disabled} {...props}>
      {loading ? (
        <Loader2 className="btn-icon spinning" size={16} />
      ) : Icon ? (
        <Icon className="btn-icon" size={16} />
      ) : null}
      {children}
    </button>
  );
};
