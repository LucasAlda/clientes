import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import authFetch from "../helpers/authFetch";
import Ticket from "./Ticket";

const Tickets = ({ history, show, user }) => {
  const { addToast } = useToasts();
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    authFetch("/tickets/complete")
      .then((data) => setTickets(data))
      .catch((err) => addToast("Error Cargando tickets!", { appearance: "error" }));
    authFetch("/user/all")
      .then((data) => setUsers(data))
      .catch((err) => addToast("Error Cargando Usuarios!", { appearance: "error" }));
    //eslint-disable-next-line
  }, [show]);

  return (
    <ul className="tickets" style={{ display: show ? "grid" : "none" }}>
      {tickets.map((ticket, i) => (
        <Ticket key={i} history={history} users={users} user={user} ticket={ticket} />
      ))}
    </ul>
  );
};

export default Tickets;
