import React from "react";
import Ticket from "./Ticket";

const Tickets = ({ tickets, handleTicket }) => {
  return (
    <ul className="tickets">
      {tickets.map((ticket, i) => (
        <Ticket key={i} {...ticket} />
      ))}
    </ul>
  );
};

export default Tickets;
