import React, { useEffect, useRef } from "react";
import "../assets/styles/Options.css";

const Options = ({ data = [], value, handleSubmit = () => {}, show = true, setShow }) => {
  const refOptions = useRef();
  useEffect(() => {
    const handleClickClose = (e) => {
      const find = e.path.findIndex((obj) => obj === refOptions.current) > -1;
      if (!find) setShow(false);
    };

    if (show) document.addEventListener("click", handleClickClose);
    return () => {
      document.removeEventListener("click", handleClickClose);
    };
  }, [show, setShow]);

  return (
    <div className={`options${show ? " open" : ""}`} ref={refOptions}>
      {data.map((option, i) => (
        <div
          className={`option${option.value === value ? " active" : ""}`}
          key={i}
          onClick={() => handleSubmit(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default Options;
