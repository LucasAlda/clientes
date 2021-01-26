import React from "react";
import "../assets/styles/Pills.css";

const Pills = ({ size = "md", color = "blue", children }) => {
  return <span className={`pill pill-${size} pill-${color}`}>{children}</span>;
};

export default Pills;
