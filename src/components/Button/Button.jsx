import React from "react";
import "./Button.scss";

// Define the Button component
const Button = ({
  label,
  onClick,
  style,
  disabled = false,
  type = "button",
  className = "",
  loading = false,
  icon = null,
  iconAlignLeft = false
}) => {
  // Handle loading state by disabling the button and displaying a loading spinner if necessary
  return (
    <div
      onClick={!disabled && !loading ? onClick : undefined}
      className={`button-container ${className} ${disabled || loading ? "btn-disabled" : ""}`}>
      <button className="button" type={type} style={style} disabled={disabled || loading}>
        {loading ? (
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"></span>
        ) : null}
        {label}
      </button>
      {icon && <span>{icon}</span>}
    </div>
  );
};

export default Button;
