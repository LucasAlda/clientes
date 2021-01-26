import { React } from "react";
import "../assets/styles/Card.css";

const Card = ({ children, className, style }) => {
  return (
    <div className={`card${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </div>
  );
};

export default Card;
