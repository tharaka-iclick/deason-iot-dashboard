import React from "react";
import "./Input.css";

export const Input = React.forwardRef(
  ({ label, error, as: Component = "input", ...props }, ref) => {
    return (
      <div className="input-group">
        {label && <label className="input-label">{label}</label>}
        <Component
          ref={ref}
          className={`input ${error ? "input-error" : ""}`}
          {...props}
        />
        {error && <span className="error-text">{error}</span>}
      </div>
    );
  }
);
