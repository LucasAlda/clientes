import React, { useState } from "react";
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

const Principal = ({ history, search, setSearch }) => {
  const [openSelectCategory, setOpenSelectCategory] = useState(false);
  const [activeTab, setActiveTab] = useState("tickets");

  const handleTicket = (ticket) => {};

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

  const dataTable = data.map((row) => ({
    handleClick: () => history.push({ pathname: `/comitente/${row.comitente}` }),
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
