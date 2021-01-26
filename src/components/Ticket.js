import React from "react";
import { FiCalendar, FiUsers } from "react-icons/fi";
import Pills from "./Pills";

const Ticket = (props) => {
  const { comitente = "", titulo = "", vencimiento = new Date(), para = "", creacion = new Date(), por = "" } = props;
  console.log(props);
  const venc = new Date(vencimiento);
  const creac = new Date(creacion);

  const diff = (venc.getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24;

  console.log(titulo, diff);

  return (
    <li>
      <div className="info">
        <h3>{comitente} </h3>
        <h4>{titulo}</h4>
      </div>
      <div className="to">
        <Pills color={diff < -2 ? "red" : diff < 0 ? "yellow" : "grey"}>
          <FiCalendar /> {venc.format()}
        </Pills>
        <FiUsers /> {para}
      </div>
      <div className="from">
        <h5>
          <span>Creado el</span> {creac.format()}
        </h5>
        <h5>
          <span>Por</span> {por}
        </h5>
      </div>
    </li>
  );
};

export default Ticket;
