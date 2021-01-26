import React from "react";
import "../assets/styles/Tabs.css";

const Tabs = ({ style, tabStyle = "pills", options, value, handleSubmit }) => {
  return (
    <ul className={`tabs tabs-${tabStyle}`} style={style}>
      {options.map((option, i) => (
        <li key={i} className={option.value === value ? "active" : ""} onClick={() => handleSubmit(option.value)}>
          {option.label}
        </li>
      ))}
    </ul>
  );
};

export default Tabs;
