import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import "../assets/styles/Tabs.css";
import Options from "./Options";

const Tabs = ({ style, tabStyle = "pills", options, value, handleSubmit }) => {
  const [mobile, setMobile] = useState(window.innerWidth < 600);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.onresize = () => setMobile(window.innerWidth < 600);
  }, []);

  return mobile ? (
    <div className={`mobile-tab tabs-${tabStyle}`} style={style} onClick={() => setOpen((prev) => !prev)}>
      {options.find((o) => o.value === value).label || "Ninguna seleccionada"}
      <FiChevronDown />
      <Options data={options} show={open} setShow={setOpen} value={value} handleSubmit={handleSubmit} />
    </div>
  ) : (
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
