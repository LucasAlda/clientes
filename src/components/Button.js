import React from "react";
import "../assets/styles/Button.css";

function Button(props) {
  const { size, color, active, className, style, onClick, icon, children, disabled = false } = props;
  return (
    <button
      disabled={disabled}
      style={style}
      aria-label={icon ? "btn-icon" : children}
      className={`btn${className ? ` ${className}` : ""}${size ? ` btn-${size}` : ""}${icon ? ` btn-icon` : ""} btn-${
        color ? color : "primary"
      }${active ? " active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
