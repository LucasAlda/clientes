import React, { useEffect, useState } from "react";
import { FiSearch, FiBell, FiMenu } from "react-icons/fi";
import { withRouter } from "react-router";
import Select from "react-select";
import "../assets/styles/Navbar.css";
import authFetch from "../helpers/authFetch";

const Navbar = ({ location, history, search, setSearch, user, setModalEspecies }) => {
  const [open, setOpen] = useState(true);
  const [comitente, setComitente] = useState("");
  const [especies, setEspecies] = useState([]);
  const section = location.pathname.split("/")[1] || "principal";

  useEffect(() => {
    authFetch("/search/especies").then((data) => {
      setEspecies(data);
    });
  }, []);

  const onSubmitComitente = (e) => {
    e.preventDefault();
    e.target.blur();
    setSearch((prev) => ({ ...prev, enter: true, text: comitente }));
    setOpen(false);
    if (section !== "principal") history.push({ pathname: "/" });
  };

  const searchComitente = (
    <form onSubmit={onSubmitComitente}>
      <div className="nav-search">
        <input
          name="text"
          type="text"
          placeholder="Buscar Comitente"
          onFocus={(e) => e.target.select()}
          value={comitente}
          onChange={(e) => setComitente(e.target.value.toUpperCase())}
          autoComplete="off"
        />
        <button type="button" onClick={onSubmitComitente}>
          <FiSearch className="search-icon" />
        </button>
      </div>
    </form>
  );

  const searchEspecie = (
    <div className="nav-search-select">
      <Select
        onMenuClose={() =>
          document
            .querySelectorAll(
              '.nav-search-select > div > div:first-of-type > div:first-of-type > div[class*="singleValue"]'
            )
            .forEach((a) => (a.innerHTML = '<span style="color: hsl(216, 12%, 65%)">Buscar Especie</span>'))
        }
        placeholder="Buscar Especie"
        onChange={(e) => e && setModalEspecies({ show: true, data: { especie: e.value } })}
        options={especies.map((a) => ({ label: a.value, value: a.value }))}
      />
      <button type="button" onClick={(e) => setModalEspecies((prev) => ({ ...prev, show: true }))}>
        <FiSearch className="search-icon" />
      </button>
    </div>
  );

  return (
    <nav className={open ? "open" : ""}>
      <div className="container">
        <div>
          <div className="nav-content">
            <div className="nav-left">
              <h1 onClick={() => history.push({ pathname: "/" })}>Clientes</h1>
              <div className="nav-pages">
                <button
                  href=""
                  className={section === "extras" ? "active" : ""}
                  onClick={() => history.push({ pathname: "/extras" })}
                >
                  Extras
                </button>
                <button
                  href=""
                  className={section === "agenda" ? "active" : ""}
                  onClick={() => history.push({ pathname: "/agenda" })}
                >
                  Agenda
                </button>
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
