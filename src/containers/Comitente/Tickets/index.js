import React, { useEffect, useRef, useState } from "react";
import { FiCalendar, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { useToasts } from "react-toast-notifications";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import authFetch from "../../../helpers/authFetch";
import Pills from "../../../components/Pills";
import "../../../assets/styles/Inbox.css";
import ModalTicket from "./ModalTicket";
import ModalTicketEdit from "./ModalTicketEdit";
import DOMPurify from "dompurify";

const Tickets = ({ history, comitenteId, match, user }) => {
  const { addToast } = useToasts();
  const cardRef = useRef(undefined);
  const [size, setSize] = useState(0);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalTicket, setModalTicket] = useState({ data: {}, show: false, action: "ADD" });
  const [modalTicketEdit, setModalTicketEdit] = useState({ data: {}, show: false, action: "ADD" });
  const [active, setActive] = useState(parseFloat(match.params?.ticketId) || undefined);

  useEffect(() => {
    Promise.all([authFetch(`/tickets/comitente/${comitenteId}`), authFetch(`/user/all/`)])
      .then((data) => {
        setTickets(data[0]);
        setUsers(data[1]);
        setLoading(false);
      })
      .catch((err) => addToast("Error cargando Tickets!", { appearance: "error" }));

    //eslint-disable-next-line
  }, [comitenteId]);

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight - (cardRef.current?.offsetTop || 0) });
    // eslint-disable-next-line
  }, [cardRef.current?.offsetTop, window.innerHeight, window.innerWidth]);

  const handleCreateTicket = (data) => {
    authFetch("/tickets/", {
      method: "POST",
      body: {
        user: user.username,
        title: data.TITULO,
        vencimiento: data.VENCIMIENTO,
        comitente: comitenteId,
        destinoArray: JSON.stringify(data.users.map((a) => a.value)),
      },
    })
      .then((data) => authFetch(`/tickets/comitente/${comitenteId}`))
      .then((data) => setTickets(data));
    setModalTicket((prev) => ({ ...prev, show: false }));
  };

  const handleEditTicket = (data) => {
    authFetch("/tickets/" + modalTicketEdit.data.ID_TICKET, {
      method: "PUT",
      body: {
        user: user.username,
        comentario: data.COMENTARIO,
        vencimiento: modalTicketEdit.data.VENCIMIENTO !== data.VENCIMIENTO ? data.VENCIMIENTO : null,
        destinoArray: JSON.stringify(data.users.map((a) => a.value)),
        estado: data.ESTADO,
        cambiarTitulo: data.CAMBIAR_TITULO,
      },
    })
      .then((data) => authFetch(`/tickets/comitente/${comitenteId}`))
      .then((data) => setTickets(data));
    setModalTicketEdit((prev) => ({ ...prev, show: false }));
  };

  const activeTicket = tickets.find((t) => t.ID_TICKET === active);

  return (
    <>
      <Card
        reference={cardRef}
        style={{ height: (size.height || 0) - 20, maxWidth: 1400, margin: "10px auto -20px auto" }}
      >
        <div className="inbox">
          {(!active || size.width >= 1000) && (
            <div className="inbox-sidebar">
              <div className="inbox-sidebar-header">
                <div className="inbox-search">
                  <FiSearch className="search-icon" />
                  <Input
                    name="text"
                    placeholder="Buscar Ticket"
                    onChange={(e) => setFilter(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    value={filter}
                    autoComplete="off"
                  />
                  <button className="cross-icon" type="button" onClick={() => setFilter("")}>
                    <FiX />
                  </button>
                </div>
              </div>
              <div className="inbox-sidebar-body">
                <Button
                  color="green"
                  style={{
                    width: "80%",
                    margin: "0 10% 10px 10%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => setModalTicket({ show: true, data: { comitenteId, user }, action: "ADD" })}
                >
                  <FiPlus style={{ strokeWidth: 3, marginRight: 5 }} />
                  Agregar
                </Button>
                {tickets
                  .filter((t) => t.TITULO.toLowerCase().includes(filter.toLowerCase()))
                  .map((ticket, i) => {
                    return (
                      <TicketItem
                        key={i}
                        ticket={ticket}
                        users={users}
                        history={history}
                        comitenteId={comitenteId}
                        active={active}
                        setActive={setActive}
                      />
                    );
                  })}
                {!loading && tickets.length < 1 && (
                  <h5 style={{ marginTop: 50, textAlign: "center", color: "hsl(222, 10%, 60%)", fontWeight: 600 }}>
                    No hay tickets
                  </h5>
                )}
              </div>
            </div>
          )}
          {(active || size.width >= 1000) && activeTicket && (
            <Chat
              setModalTicketEdit={setModalTicketEdit}
              activeTicket={activeTicket}
              setActive={setActive}
              size={size}
              user={user}
            />
          )}
          {!activeTicket && (
            <h4
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "hsl(220, 10%, 60%)",
                transform: "translateY(-10px)",
              }}
            >
              No hay Ticket seleccionado
            </h4>
          )}
        </div>
      </Card>
      <ModalTicket modal={modalTicket} users={users} setModal={setModalTicket} handleSubmit={handleCreateTicket} />
      <ModalTicketEdit
        modal={modalTicketEdit}
        users={users}
        setModal={setModalTicketEdit}
        handleSubmit={handleEditTicket}
      />
    </>
  );
};

const TicketItem = ({ ticket, active, setActive, users, history, comitenteId }) => {
  const venc = new Date(ticket.VENCIMIENTO);

  const dest =
    ["", ...JSON.parse(ticket.DESTINO_ARRAY || "[]")].reduce(
      (acc, curr) => acc + " " + (users.find((us) => us.sub === parseInt(curr))?.username || "#" + curr)
    ) || "Todos";

  const diff = (venc.getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24;

  return (
    <div
      key={ticket.ID_TICKET}
      className={`ticket-item${active === ticket.ID_TICKET ? " active" : ""}`}
      onClick={() => {
        history.push({
          pathname: `/${history.location.pathname.split("/")[1]}/${comitenteId}/tickets/${
            active !== ticket.ID_TICKET ? ticket.ID_TICKET : ""
          }`,
        });
        setActive((prev) => (prev !== ticket.ID_TICKET ? ticket.ID_TICKET : undefined));
      }}
    >
      <div>
        <div className="details">
          <Pills color={ticket.ESTADO !== 1 ? "transparent" : diff < -2 ? "red" : diff < 0 ? "yellow" : "grey"}>
            <FiCalendar /> {venc.format()}
          </Pills>

          {ticket.ESTADO !== 1 ? (
            <Pills color={ticket.ESTADO === 0 ? "green" : "red"}>{ticket.ESTADO === 0 ? "Hecho" : "Anulado"}</Pills>
          ) : (
            <h6>Para {dest}</h6>
          )}
        </div>
        <h4>{ticket.TITULO}</h4>
      </div>
    </div>
  );
};

const Chat = ({ activeTicket, setActive, size, user, setModalTicketEdit }) => {
  const chatBody = useRef(undefined);

  useEffect(() => {
    if (chatBody.current) chatBody.current.scrollBy({ behaviour: "smooth", top: 10000000 });
  }, [activeTicket]);

  return (
    <div className="chat">
      <div className="chat-header">
        <h4>
          {size.width > 1000 && <span>#{activeTicket.ID_TICKET}</span>} {activeTicket.TITULO}
        </h4>
        <Pills color="transparent" style={{ width: 160, textAlign: "right" }}>
          <FiCalendar /> {new Date(activeTicket.VENCIMIENTO).format()}
        </Pills>
      </div>
      <div className="chat-body" ref={chatBody}>
        {activeTicket.movs.map((bubble, i) => (
          <div
            key={i}
            className={`message ${bubble.USUARIO_MOV === user.username ? "mine" : "other"}${
              new Date(bubble.VENCIMIENTO).getFullYear() > 2000 ? " venc" : ""
            }${bubble.ESTADO === 1 ? "" : bubble.ESTADO === 0 ? " finalizado" : " anulado"}`}
          >
            {bubble.USUARIO_MOV !== user.username && <h4 className="user">{bubble.USUARIO_MOV}</h4>}
            <span className="date">{new Date(bubble.FECHA_MOV).format()}</span>
            <div className="bubble">
              <span
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(bubble.COMENTARIO.replace(/(\r\n|\n|\r)/gm, "<br>")),
                }}
              ></span>
              {new Date(bubble.VENCIMIENTO).getFullYear() > 2000 && (
                <div className="new-venc">Vto. {new Date(bubble.VENCIMIENTO).format()}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        {size.width >= 1000 || (
          <Button color="secondary" onClick={() => setActive(undefined)}>
            Volver
          </Button>
        )}
        <Button color="green" onClick={() => setModalTicketEdit({ show: true, action: "ADD", data: activeTicket })}>
          Escribir
        </Button>
      </div>
    </div>
  );
};

export default Tickets;
