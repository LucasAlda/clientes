import React from "react";
import "../assets/styles/Placeholder.css";

const Placeholder = ({ width, height }) => {
  return (
    <div class="placeholder" style={{ width, height }}>
      <div class="animated-background"></div>
    </div>
  );
};

export default Placeholder;
