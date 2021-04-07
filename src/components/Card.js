import React from "react";
import "../assets/styles/Card.css";

const Card = ({ reference, children, className, style }) => {
  return (
    <div ref={reference} className={`card${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </div>
  );
};

const MemoizedCard = React.memo(Card);
export default MemoizedCard;
