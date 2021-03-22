import React, { useEffect, useState } from "react";
import { FiAlertTriangle, FiChevronDown } from "react-icons/fi";
import "../../assets/styles/Principal.css";
import Card from "../../components/Card";
import Options from "../../components/Options";
import Pills from "../../components/Pills";
import { Table } from "../../components/Table";
import Tabs from "../../components/Tabs";
import "../../assets/styles/Tickets.css";
import Tickets from "../../components/Tickets";
import Birthdays from "../../components/Birthdays";
import authFetch from "../../helpers/authFetch";
import Saldos from "./Saldos";
import Mercado from "./Mercado";

const Principal = ({ location, history, search, setSearch, user }) => {
  const [openSelectCategory, setOpenSelectCategory] = useState(false);
  const [activeTab, setActiveTab] = useState(location.pathname.split("/")[1] || "tickets");
  const [searchResult, setSearchResult] = useState({ loading: true, data: [] });

  useEffect(() => {
    if (search.enter) {
      authFetch("/search", {
        method: "POST",
        body: search,
      })
        .then((data) => setSearchResult({ loading: false, data }))
        .catch((err) => console.log(err));
    }
  }, [search]);

  const dataTable = searchResult.data.map((row) => ({
    handleClick: () =>
      history.push({ pathname: `/${row.TIPO_COMITENTE === 99 ? "proveedor" : "comitente"}/${row.COMITENTE}/` }),
    className: row.COMITENTE_ANULADO === -1 ? "text-red" : "",
    cells: [
      { className: "text-center", style: { fontWeight: 600 }, content: row.COMITENTE },
      { content: row.NOMBRE_CUENTA },
      {
        content: (
          <Pills color={row.TIPO_COMITENTE === 0 ? "green" : row.TIPO_COMITENTE === -1 ? "blue" : "red"}>
            {row.TIPO_COMITENTE === 0 ? "Jurídica" : row.TIPO_COMITENTE === -1 ? "Física" : "Proveedor"}
          </Pills>
        ),
      },
      { className: "text-truncate", style: { maxWidth: 400 }, content: row.MAIL },
      { content: row.TELEFONO },
    ],
  }));

  return (
    <>
      <div className="header-extended principal" style={{ height: 135 }}>
        <h3>
          {search.text ? (
            <>
              <span>{search.text}</span> en
            </>
          ) : (
            "Buscar en"
          )}
          <div
            className="select-category"
            onClick={() => {
              setOpenSelectCategory((prev) => !prev);
            }}
          >
            {search.type === "activos"
              ? "Comitentes Activos"
              : search.type === "todos"
              ? "Todos los Comitentes"
              : "Proveedores"}
            <FiChevronDown />
            <Options
              show={openSelectCategory}
              setShow={setOpenSelectCategory}
              handleSubmit={(value) => {
                setSearch((prev) => ({ ...prev, type: value }));
              }}
              value={search.type}
              data={[
                { label: "Comitentes Activos", value: "activos" },
                { label: "Todos los Comitentes", value: "todos" },
                { label: "Proveedores", value: "proveedores" },
              ]}
            />
          </div>
        </h3>
      </div>
      <div className="container">
        <Card style={{ marginTop: -70, height: "calc((100vh - 220px) / 2 - 30px)" }}>
          <Table
            data={dataTable}
            columns={[
              { content: "Comitente", sortable: false, filterable: false },
              { className: "text-left", content: "Nombre de Cuenta", sortable: false, filterable: false },
              { className: "text-left", content: "Tipo", sortable: false, filterable: false },
              { className: "text-left", content: "Mail", sortable: false, filterable: false },
              { className: "text-left", content: "Telefono", sortable: false, filterable: false },
            ]}
          />
          {!search.enter && (
            <h4
              style={{
                color: "hsl(220, 10%,60%)",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Haga una búsqueda para obtener comitentes
            </h4>
          )}
          {search.enter && !searchResult.loading && searchResult.data.length < 1 && (
            <h4
              style={{
                color: "hsl(220, 10%,60%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <FiAlertTriangle style={{ width: 25, height: 15, strokeWidth: 3 }} />
              No hay Comitentes que coincidan
            </h4>
          )}
        </Card>
        <div style={{ paddingTop: 30 }}>
          <Tabs
            tabStyle="folder"
            value={activeTab}
            handleSubmit={(value) => {
              history.push(`/${value}/`);
              setActiveTab(value);
            }}
            options={[
              { label: "Tickets", value: "tickets" },
              { label: "Saldos del Día", value: "saldos" },
              { label: "Liq Mercado", value: "mercado" },
              { label: "Liq Mer Cable", value: "mercado-cable" },
              { label: "Liq Mer MEP", value: "mercado-mep" },
            ]}
          />
          <div className="bottom-section">
            <Card>
              <Tickets show={activeTab === "tickets"} history={history} user={user} />
              <Saldos show={activeTab === "saldos"} history={history} />
              <Mercado
                show={"mercado|mercado-cable|mercado-mep".includes(activeTab)}
                history={history}
                type={activeTab}
              />
            </Card>
            <Card>
              <Birthdays />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Principal;
