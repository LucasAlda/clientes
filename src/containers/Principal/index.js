import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
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

const Principal = ({ history, search, setSearch }) => {
  const [openSelectCategory, setOpenSelectCategory] = useState(false);
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchResult, setSearchResult] = useState([]);

  const handleTicket = (ticket) => {};

  const tickets = [
    {
      comitente: 12207,
      titulo: "Transferir a Rafa",
      vencimiento: "2020-02-05",
      creacion: "2020-02-04",
      para: "Daniela",
      por: "Exe",
    },
    {
      comitente: 13132,
      titulo: "LEANDRO 153-435-0794",
      vencimiento: "2020-07-01",
      creacion: "2015-08-20",
      para: "Todos",
      por: "Dolores",
    },
    {
      comitente: "General",
      titulo: "Actualizar certificados de la intranet",
      vencimiento: "2020-07-01",
      creacion: "2015-08-20",
      para: "Todos",
      por: "Dolores",
    },
    {
      comitente: 13605,
      titulo: "Chequear que este todo correcto",
      vencimiento: "2021-01-25",
      creacion: "2015-08-20",
      para: "Todos",
      por: "Dolores",
    },
    {
      comitente: 13600,
      titulo: "Mandar valores",
      vencimiento: "2021-01-25",
      creacion: "2015-08-20",
      para: "Todos",
      por: "Exequiel",
    },
    {
      comitente: 2019,
      titulo: "telefono 4793-1793",
      vencimiento: "2021-08-26",
      creacion: "2015-08-20",
      para: "Todos",
      por: "Dolores",
    },
    {
      comitente: 10234,
      titulo: "Mandar Valores",
      vencimiento: "2021-09-26",
      creacion: "2015-08-20",
      para: "Todos",
      por: "Dolores",
    },
    {
      comitente: 802,
      titulo: "Transferir a Banelco",
      vencimiento: "2021-09-26",
      creacion: "2015-08-20",
      para: "Javier",
      por: "Dolores",
    },
    {
      comitente: 1801,
      titulo: "Comprar Dolares",
      vencimiento: "2021-09-26",
      creacion: "2015-08-20",
      para: "Antonio",
      por: "Dolores",
    },
    {
      comitente: 1801,
      titulo: "Consultar a Byma sobre cheque",
      vencimiento: "2021-08-14",
      creacion: "2015-03-20",
      para: "Antonio",
      por: "Dolores",
    },
  ];

  useEffect(() => {
    if (search.enter) {
      authFetch("/search", {
        method: "POST",
        body: search,
      })
        .then((data) => setSearchResult(data))
        .catch((err) => console.log(err));
    }
  }, [search]);

  console.log(searchResult);

  const dataTable = searchResult.map((row) => ({
    handleClick: () => history.push({ pathname: `/comitente/${row.COMITENTE}/` }),
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
          <div className="select-category" onClick={() => setOpenSelectCategory((prev) => !prev)}>
            {search.type === "activos"
              ? "Comitentes Activos"
              : search.type === "todos"
              ? "Todos los Comitentes"
              : "Proveedores"}{" "}
            <FiChevronDown />
            <Options
              show={openSelectCategory}
              setShow={setOpenSelectCategory}
              handleSubmit={(value) => setSearch((prev) => ({ ...prev, type: value }))}
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
        </Card>
        <div style={{ paddingTop: 30 }}>
          <Tabs
            tabStyle="folder"
            value={activeTab}
            handleSubmit={(value) => setActiveTab(value)}
            options={[
              { label: "Tickets", value: "tickets" },
              { label: "Saldos del Día", value: "saldos" },
              { label: "Liq Mercado", value: "LiqMer" },
              { label: "Liq Mer Cable", value: "LiqMerCable" },
              { label: "Liq Mer MEP", value: "LiqMerMEP" },
            ]}
          />
          <div className="bottom-section">
            <Card>
              <Tickets tickets={tickets} onClick={handleTicket} />
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
