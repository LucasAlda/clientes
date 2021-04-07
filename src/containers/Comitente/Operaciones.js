import React, { useEffect, useRef, useState } from "react";
import Card from "../../components/Card";
import Copy from "../../components/Copy";
import { Table } from "../../components/Table";
import authFetch from "../../helpers/authFetch";

const Operaciones = ({ match, comitenteId }) => {
  const [data, setData] = useState([]);
  const operacionesRef = useRef();

  useEffect(() => {
    authFetch(`/comitente/operaciones/${comitenteId}`)
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
      });
  }, [comitenteId]);

  const dataTableOp = [];
  let totalOp = 0;
  (data.operaciones || []).forEach((row) => {
    totalOp += row.IVAPesos + row.DerechosPesos + row.ArancelPesos + (row.CodMoneda === 1 ? row.BRUTO : 0);
    dataTableOp.push({
      cells: [
        { className: "text-center", content: new Date(row.FecConcert).format() },
        { className: "text-center", content: row.SERESP },
        { className: "text-center", content: row.OPERACION },
        { className: "text-center", content: row.Plazo },
        { className: "text-right", content: (row.CANT || 0).format() },
        { className: "text-right", content: (row.PPP || 0).format() },
        { className: "text-right", content: row.MonedaSimbolo + " " + (row.BRUTO || 0).format() },
        { className: "text-center", content: (row.ARANCEL || 0).format() },
        { className: "text-right", content: (row.ArancelPesos || 0).format() },
        {
          className: "text-right",
          content: (
            row.IVAPesos +
            row.DerechosPesos +
            row.ArancelPesos +
            (row.CodMoneda === 1 ? row.BRUTO : 0)
          ).format(),
        },
      ],
    });
  });

  dataTableOp.push({
    className: "header",
    cells: [
      { content: "Total Neto", colspan: 9 },
      { className: "text-right", content: totalOp.format() },
    ],
  });

  const dataTableCau = [];
  let totalCau = 0;
  (data.cauciones || []).forEach((row) => {
    totalCau += row.MontoCont;
    dataTableCau.push({
      cells: [
        { className: "text-center", content: new Date(row.FecConcert).format() },
        { className: "text-center", content: row.Operacion },
        { className: "text-right", content: (row.Cantidad || 0).format() },
        { className: "text-center", content: row.Plazo },
        { className: "text-center", content: row.Tasa.format() + "%" },
        { className: "text-right", content: row.MontoCont.format() },
        { className: "text-right", content: row.MontoFut.format() },
      ],
    });
  });

  dataTableCau.push({
    className: "header",
    cells: [
      { content: "Total Neto", colspan: 6 },
      { className: "text-right", content: totalCau.format() },
    ],
  });

  return (
    <>
      <div ref={operacionesRef}>
        {data.operaciones?.length > 0 && (
          <>
            <h4 style={{ marginTop: 15, marginBottom: 0 }}>Operaciones</h4>
            <Card style={{ marginTop: 10 }}>
              <Table
                className="position"
                columns={[
                  { className: "text-center", content: "Fecha" },
                  { className: "text-center", content: "Especie" },
                  { className: "text-center", content: "Operación" },
                  { className: "text-center", content: "Plazo" },
                  { className: "text-right", content: "Cantidad" },
                  { className: "text-right", content: "PPP" },
                  { className: "text-right", content: "Bruto" },
                  { className: "text-center", content: "Arancel" },
                  { className: "text-right", content: "Arancel Pesos" },
                  { className: "text-right", content: "Neto Pesos" },
                ]}
                data={[...dataTableOp, { cells: [] }]}
              />
            </Card>
          </>
        )}
        {data.cauciones?.length > 0 && (
          <>
            <h4 style={{ marginTop: 15, marginBottom: 0 }}>Cauciones</h4>
            <Card style={{ marginTop: 10 }}>
              <Table
                className="position"
                columns={[
                  { className: "text-center", content: "Fecha" },
                  { className: "text-center", content: "Operación" },
                  { className: "text-right", content: "Cantidad" },
                  { className: "text-center", content: "Plazo" },
                  { className: "text-center", content: "Tasa" },
                  { className: "text-right", content: "Monto Contado" },
                  { className: "text-right", content: "Monto Futuro" },
                ]}
                data={dataTableCau}
              />
            </Card>
          </>
        )}
        {data.cauciones?.length === 0 && data.operaciones?.length === 0 && (
          <h4 style={{ color: "#808080", textAlign: "center", marginTop: 40 }}>No hubo Movimientos Hoy</h4>
        )}
      </div>
      <Copy style={{ marginTop: 15 }} reference={operacionesRef} />
    </>
  );
};

export default Operaciones;
