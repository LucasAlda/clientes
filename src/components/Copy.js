import React from "react";
import { FiCopy, FiImage } from "react-icons/fi";
import { useToasts } from "react-toast-notifications";
import Button from "./Button";

const Copy = ({ reference, style, actions = false, backgroundColor }) => {
  const { addToast } = useToasts();
  const handleClick = () => {
    if (!reference?.current) return;
    const selection = document.createRange();
    const clone = reference.current.cloneNode(true);
    clone.style.width = "1350px";
    clone.style.marginTop = "1000px";
    clone.style.padding = "0.1px 10px 20px 10px";
    clone.style.left = "15px";
    if (backgroundColor) clone.style.backgroundColor = backgroundColor;

    Array.from(clone.querySelectorAll("tr")).forEach((row) => {
      const cells = Array.from(row.querySelectorAll("th, td"));
      if (actions) row.removeChild(cells[cells.length - 1]);
      cells.filter((a) => a.className.includes("remove-copy")).forEach((cell) => row.removeChild(cell));
    });

    document.body.appendChild(clone);
    selection.selectNodeContents(clone);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(selection);
    document.execCommand("copy");
    document.body.removeChild(clone);
    window.getSelection().removeRange(selection);
    addToast("Tabla copiada!", { appearance: "success" });
  };

  const handleClickImg = () => {
    if (!reference?.current || !navigator.clipboard) {
      addToast("No se pudo copiar!", { appearance: "error" });
      return;
    }

    const clone = reference.current.cloneNode(true);
    clone.style.width = "1350px";
    clone.style.marginTop = "1000px";
    clone.style.padding = "0.1px 10px 20px 10px";
    clone.style.left = "15px";
    if (backgroundColor) clone.style.backgroundColor = backgroundColor;

    Array.from(clone.querySelectorAll("tr")).forEach((row) => {
      const cells = Array.from(row.querySelectorAll("th, td"));
      cells.filter((a) => a.className.includes("remove-copy")).forEach((cell) => row.removeChild(cell));
    });

    document.body.appendChild(clone);

    window
      .html2canvas(clone, {
        scale: 2,
        backgroundColor: "#dfe0e4",
      })
      .then((canvas) => {
        document.body.removeChild(clone);
        canvas.toBlob((blob) =>
          navigator.clipboard
            .write([new window.ClipboardItem({ "image/png": blob })])
            .then((data) => addToast("Copiado!", { appearance: "success" }))
            .catch((data) => addToast("Error al copiar!", { appearance: "error" }))
        );
      })
      .catch((data) => addToast("Error al generar Imagen!", { appearance: "error" }));
  };

  return (
    <>
      <Button style={style} size="xs" onClick={handleClick}>
        <FiCopy style={{ height: 14, marginBottom: -2 }} /> Copiar
      </Button>
      <Button style={{ ...style, marginLeft: 5 }} size="xs" onClick={handleClickImg}>
        <FiImage style={{ height: 14, marginBottom: -2 }} /> Exportar Imagen
      </Button>
    </>
  );
};

export default Copy;
