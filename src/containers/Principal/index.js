import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import "../../assets/styles/Principal.css";
import Card from "../../components/Card";
import Options from "../../components/Options";
import Pills from "../../components/Pills";
import { Table } from "../../components/Table";
import Tabs from "../../components/Tabs";
import "../../assets/styles/Tickets.css";
import Ticket from "../../components/Ticket";

const Principal = ({ search, setSearch }) => {
  const [openSelectCategory, setOpenSelectCategory] = useState(false);
  const [activeTab, setActiveTab] = useState("tickets");

  const data = [
    {
      comitente: 10351,
      nombreCuenta: "ALDAZABAL Y CIA FRACCIONES DE TERCEROS",
      tipoCuenta: "J",
      mail: "exequiel@aldazabal.sba.com.ar",
      telefono: "4394-4428/6818/4613",
    },
    {
      comitente: 10961,
      nombreCuenta: "ALDAZABAL Y COMPANIA S.A.",
      tipoCuenta: "J",
      mail: "exequiel@aldazabal.sba.com.ar",
      telefono: "4394-4613/6818",
    },
    {
      comitente: 11642,
      nombreCuenta: "ALDAZABAL IGNACIO RAFAEL (NAEX) Y/O IGLESIAS BLANCO IGNACIO Y/O ALDAZABAL EXE",
      tipoCuenta: "F",
      mail: "ia@naex.com.ar;ni@naex.com.ar",
      telefono: "4394-6818 155-626-0808",
    },
    {
      comitente: 12136,
      nombreCuenta: "ALDAZABAL Y COMPANIA S.A. CUENTA SUSCRIPCION , lLICITACION Y CANJE EN CURSO",
      tipoCuenta: "F",
      mail: "exequiel@aldazabal.sba.com.ar",
      telefono: "4394-4613/6818",
    },
    {
      comitente: 12965,
      nombreCuenta: "ALDAZABAL SEBASTIAN RAFAEL Y/O ALDAZABAL EXEQUIEL RAFAEL Y/O HERBIN LUCILA",
      tipoCuenta: "F",
      mail: "sebastian@aldazabal.com.ar;saldazab",
      telefono: "4394-6818 155-626-0811",
    },
  ];

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
      comitente: 13605,
      titulo: "Chequear que este todo correcto",
      vencimiento: "2021-01-25",
      creacion: "2015-08-20",
      para: "Todos",
      por: "Dolores",
    },
    {
      comitente: 2019,
      titulo: "telefono 4793-1793",
      vencimiento: "2021-08-26",
      creacion: "2015-08-20",
      para: "Todos",
      por: "Dolores",
    },
  ];

  const dataTable = data.map((row) => ({
    cells: [
      { style: { fontWeight: 600 }, content: row.comitente },
      { content: row.nombreCuenta },
      {
        content: (
          <Pills color={row.tipoCuenta === "J" ? "green" : "blue"}>
            {row.tipoCuenta === "J" ? "Jurídica" : "Física"}
          </Pills>
        ),
      },
      { content: row.mail },
      { content: row.telefono },
    ],
  }));

  return (
    <>
      <div className="header-extended principal" style={{ height: 100 }}>
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
        <Card style={{ marginTop: -20, height: "calc((100vh - 240px) / 2 - 30px)" }}>
          <Table
            data={dataTable}
            columns={[
              { content: "Comitente", sortable: false, filterable: false },
              { content: "Nombre de Cuenta", sortable: false, filterable: false },
              { content: "Tipo", sortable: false, filterable: false },
              { content: "Mail", sortable: false, filterable: false },
              { content: "Telefono", sortable: false, filterable: false },
            ]}
          />
        </Card>
        <div style={{ paddingTop: 20 }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
            <Card>
              <ul className="tickets">
                {tickets.map((ticket, i) => (
                  <Ticket key={i} {...ticket} />
                ))}
              </ul>
            </Card>
            <Card></Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Principal;
