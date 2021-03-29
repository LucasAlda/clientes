import React, { useEffect, useState } from "react";
import { Table } from "../../components/Table";
import authFetch from "../../helpers/authFetch";

const Saldos = ({ history, show }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    authFetch("/bottom/saldosdia")
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, [show]);
  return (
    <div style={{ display: show ? "block" : "none" }}>
      <Table
        style={{ overflow: "inherit" }}
        columns={[
          {
            content: "Comitente",
            style: { position: "sticky", top: 0, background: "#f9fafb", boxShadow: "0px 2px 2px #e5e7eb" },
          },
          {
            className: "text-left",
            style: { position: "sticky", top: 0, background: "#f9fafb", boxShadow: "0px 2px 2px #e5e7eb" },
            content: "Descripción",
          },
          {
            style: { position: "sticky", top: 0, background: "#f9fafb", boxShadow: "0px 2px 2px #e5e7eb" },
            className: "text-right",
            content: "Monto Pesos",
          },
          {
            style: { position: "sticky", top: 0, background: "#f9fafb", boxShadow: "0px 2px 2px #e5e7eb" },
            className: "text-right",
            content: "Caucionable",
          },
          {
            style: { position: "sticky", top: 0, background: "#f9fafb", boxShadow: "0px 2px 2px #e5e7eb" },
            className: "text-right",
            content: "Caucionado Hoy",
          },
          {
            style: { position: "sticky", top: 0, background: "#f9fafb", boxShadow: "0px 2px 2px #e5e7eb" },
            className: "text-right",
            content: "Saldo",
          },
        ]}
        data={data.map((row) => ({
          handleClick: () => history.push({ pathname: `/comitente/${row.COMITENTE}/caucionable/` }),
          cells: [
            { className: "text-center", content: row.COMITENTE },
            { content: row.DESCRIPCION },
            { className: `text-right ${row.MONTO_PESOS > 0 ? "" : " text-red"}`, content: row.MONTO_PESOS.format() },
            { className: "text-right ", content: (row.CAUCIONABLE || 0).format() },
            { className: "text-right", content: (row.CAUCIONADO_HOY || 0).format() },
            {
              className: `text-right ${row.MONTO_PESOS + (row.CAUCIONADO_HOY || 0) < 0 ? "text-red" : ""}`,
              content: (row.MONTO_PESOS + (row.CAUCIONADO_HOY || 0)).format(),
            },
          ],
        }))}
      />
    </div>
  );
};

export default Saldos;
