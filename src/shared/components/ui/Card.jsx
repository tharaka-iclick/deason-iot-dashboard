import React from "react";
import "./Card.css";

export const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
};
