import React from "react";
import { FiCopy } from "react-icons/fi";
import Button from "./Button";

const Copy = ({ reference, style, actions = false }) => {
  const handleClick = () => {
    if (!reference?.current) return;
    if (actions) {
      const selection = document.createRange();
      const clone = reference.current.cloneNode(true);
      Array.from(clone.querySelectorAll("tr")).forEach((row) => {
        const cells = Array.from(row.querySelectorAll("th, td"));
        if (cells[cells.length - 1]) row.removeChild(cells[cells.length - 1]);
      });
      document.body.appendChild(clone);
      selection.selectNodeContents(clone);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(selection);
      document.execCommand("copy");
      document.body.removeChild(clone);
      window.getSelection().removeRange(selection);
    } else {
      const selection = document.createRange();
      selection.selectNodeContents(reference.current);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(selection);
      document.execCommand("copy");
      window.getSelection().removeRange(selection);
    }
  };

  return (
    <Button style={style} size="xs" onClick={handleClick}>
      <FiCopy style={{ height: 14, marginBottom: -2 }} /> Copiar
    </Button>
  );
};

export default Copy;
