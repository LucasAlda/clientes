import React from "react";
import { FiGift } from "react-icons/fi";

const Birthdays = () => {
  const data = [
    { persona: "LENARDUZZI JOSE LUIS", nacimiento: "1941-01-22" },
    { persona: "TARRIS HELENA ANA", nacimiento: "1947-01-22" },
    { persona: "BERNAL MARIA GRACIELA", nacimiento: "1954-01-22" },
    { persona: "FERRANTE GISELA ALEJANDRA", nacimiento: "1963-01-22" },
    { persona: "FIORIO FLAVIA DANIELA", nacimiento: "1980-01-24" },
    { persona: "ROBINO NILDA CATALINA DE GABRIELLI", nacimiento: "1980-01-24" },
    { persona: "SPORN DANIEL LEONARDO", nacimiento: "1978-01-26" },
    { persona: "BERNAL MARIA GRACIELA", nacimiento: "1990-01-26" },
    { persona: "MOSCOLONI MARCELA PATRICIA", nacimiento: "1994-01-27" },
    { persona: "SPORN DANIEL LEONARDO", nacimiento: "1979-01-31" },
    { persona: "BABIC LILIANA", nacimiento: "1979-02-01" },
    { persona: "DUCHINI MORENO HUGO RICARDO", nacimiento: "1941-02-02" },
  ];
  return (
    <ul
      style={{ padding: "5px 0", position: "relative", margin: 0, display: "grid", borderBottom: "1px solid #e5e7eb" }}
    >
      {data.map((birthday) => (
        <li
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 20px",
            borderBottom: "1px solid #e5e7eb",
            width: "100%",
          }}
        >
          <h4 style={{ margin: 0, color: "#575757" }}>{birthday.persona}</h4>
          <div style={{ textAlign: "right", color: "hsl(220, 10%, 65%)" }}>
            <h5 style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <FiGift style={{ marginRight: 5 }} />
              {parseInt(
                (new Date().getTime() - new Date(birthday.nacimiento).getTime()) / 1000 / 60 / 60 / 24 / 365
              )}{" "}
              años
            </h5>
            <h5 style={{ margin: 0 }}>{new Date(birthday.nacimiento).format()}</h5>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Birthdays;
