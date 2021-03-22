import React from "react";
import { FiCalendar, FiUsers } from "react-icons/fi";
import Pills from "./Pills";

const Ticket = ({ history, ticket, users = [], user }) => {
  const {
    COMITENTE = "",
    TITULO = "",
    VENCIMIENTO = new Date(),
    USUARIO_DESTINO = "",
    DESTINO_ARRAY = "[]",
    FECHA_ORIGEN = new Date(),
    USUARIO_ORIGEN = "",
  } = ticket;

  const venc = new Date(VENCIMIENTO);
  const creac = new Date(FECHA_ORIGEN);

  const dest =
    ["", ...JSON.parse(DESTINO_ARRAY || "[]")].reduce(
      (acc, curr) => acc + " " + (users.find((us) => us.sub === parseInt(curr))?.username || "#" + curr)
    ) || "Todos";

  const mine =
    JSON.parse(DESTINO_ARRAY || "[]").findIndex((u) => u === user?.sub) > -1 ||
    JSON.parse(DESTINO_ARRAY || "[]").length < 1;

  const diff = (venc.getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24;

  return (
    <li
      className={`ticket${mine ? " mine" : ""}`}
      onClick={() => history.push({ pathname: `/comitente/${COMITENTE}/tickets/${ticket.ID_TICKET}` })}
    >
      <div className="info">
        <h3>{COMITENTE} </h3>
        <h4>{TITULO}</h4>
      </div>
      <div className="to">
        <Pills color={diff < -2 ? "red" : diff < 0 ? "yellow" : "grey"}>
          <FiCalendar /> {venc.format()}
        </Pills>
        <FiUsers /> {JSON.parse(DESTINO_ARRAY || "[]").length > 0 ? dest : USUARIO_DESTINO.replace("@", "")}
      </div>
      <div className="from">
        <h5>
          <span>Creado el</span> {creac.format()}
        </h5>
        <h5>
          <span>Por</span> {USUARIO_ORIGEN}
        </h5>
      </div>
    </li>
  );
};

export default Ticket;
