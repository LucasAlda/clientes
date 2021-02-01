import { useState } from "react";

const useDraggable = (modal) => {
  const [position, setPosition] = useState({ left: 0, top: 0 });

  const handleDrag = (e) => {
    e.preventDefault();
    if (!modal) return;
    modal.style.position = "relative";
    const modalPos = modal.getBoundingClientRect();
    const absToRel = { x: window.innerWidth / 2 - modalPos.width / 2, y: 30 };
    const cancelPos = { y: e.clientY - modalPos.top, x: e.clientX - modalPos.left };

    const move = (event) => {
      const pos = { x: event.clientX, y: event.clientY };
      setPosition({ top: pos.y - cancelPos.y - absToRel.y, left: pos.x - cancelPos.x - absToRel.x });
    };

    document.body.addEventListener("mousemove", move);
    document.body.addEventListener("mouseup", () => {
      document.body.removeEventListener("mousemove", move);
    });
  };

  return [position, handleDrag];
};

export default useDraggable;
