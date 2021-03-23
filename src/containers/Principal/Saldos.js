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
        columns={[
          { content: "Comitente" },
          { className: "text-left", content: "Descripción" },
          { className: "text-right", content: "Monto Pesos" },
          { className: "text-right", content: "Caucionable" },
          { className: "text-right", content: "Caucionado Hoy" },
          { className: "text-right", content: "Saldo" },
        ]}
        data={data.map((row) => ({
          handleClick: () => history.push({ pathname: `/comitente/${row.COMITENTE}/caucionable/` }),
          cells: [
            { className: "text-center", content: row.COMITENTE },
            { content: row.DESCRIPCION },
            { className: "text-right text-red", content: row.MONTO_PESOS.format() },
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
