import React, { useState } from "react";
import { FiSearch, FiBell, FiX, FiMenu } from "react-icons/fi";
import { withRouter } from "react-router";
import "../assets/styles/Navbar.css";

const Navbar = ({ location, history, search, setSearch, user }) => {
  const [open, setOpen] = useState(false);
  const [comitente, setComitente] = useState("");
  const [especie, setEspecie] = useState("");
  const section = location.pathname.split("/")[1] || "principal";

  const onSubmitComitente = (e) => {
    e.preventDefault();
    e.target.blur();
    setSearch((prev) => ({ ...prev, enter: true, text: comitente }));
    setOpen(false);
    if (section !== "principal") history.push({ pathname: "/" });
  };
  const onSubmitEspecie = (e) => {
    e.preventDefault();
    console.log(especie);
  };

  const searchComitente = (
    <form onSubmit={onSubmitComitente}>
      <div className="nav-search">
        <FiSearch className="search-icon" />
        <input
          name="text"
          type="text"
          placeholder="Buscar Comitente"
          onFocus={(e) => e.target.select()}
          value={comitente}
          onChange={(e) => setComitente(e.target.value.toUpperCase())}
          autoComplete="off"
        />
        <button className="cross-icon" type="button" onClick={() => setComitente("")}>
          <FiX />
        </button>
      </div>
    </form>
  );

  const searchEspecie = (
    <form onSubmit={onSubmitEspecie}>
      <div className="nav-search">
        <FiSearch className="search-icon" />
        <input
          name="text"
          type="text"
          placeholder="Buscar Especie"
          value={especie}
          onChange={(e) => setEspecie(e.target.value.toUpperCase())}
          autoComplete="off"
        />
        <button className="cross-icon" type="button" onClick={() => setEspecie("")}>
          <FiX />
        </button>
      </div>
    </form>
  );

  return (
    <nav className={open ? "open" : ""}>
      <div className="container">
        <div>
          <div className="nav-content">
            <div className="nav-left">
              <h1 onClick={() => history.push({ pathname: "/" })}>Clientes</h1>
              <div className="nav-pages">
                <button href="" className="active">
                  Extras
                </button>
                <button href="">Agenda</button>
              </div>
              {searchComitente}
            </div>
            <div className="nav-right">
              {searchEspecie}
              <div className="actions">
                <>
                  <button className="alerts">
                    <FiBell />
                  </button>
                  <button className="user">{user.abv || ""}</button>
                </>
                <button className="menu-button" onClick={() => setOpen((prev) => !prev)}>
                  <FiMenu />
                </button>
              </div>
            </div>
          </div>
          <div className="mobile-menu">
            <div className="nav-pages">
              <button href="" className="active">
                Extras
              </button>
              <button href="">Agenda</button>
            </div>
            {searchComitente}
            {searchEspecie}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Navbar);
