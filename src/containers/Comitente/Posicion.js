import React, { useRef } from "react";
import Card from "../../components/Card";
import Copy from "../../components/Copy";
import { Table } from "../../components/Table";

const Posicion = ({ match, comitenteId, posicion, loading }) => {
  const tablaPosicion = useRef(undefined);
  const tipoData = {
    "##ESPECIES##": { order: 1, name: "Especies" },
    "##SERIES##": { order: 2, name: "Opciones" },
    "##SALDOSMON##": { order: 3, name: "Moneda" },
    "##FONDOS##": { order: 4, name: "Fondos" },
  };

  const tipoNombre = {
    "TITULOS PUBLICOS / PESOS": "TITULOS PUBLICOS",
    "ACCIONES / PESOS": "ACCIONES",
    "ACCIONES / DOLAR CABLE": "ACCIONES",
    "MONEDA / DOLAR CABLE": "MONEDA",
    "MONEDA / EURO": "MONEDA",
    "Series / PESOS": "OPCIONES",
    PESOS: "MONEDA",
    "DOLAR MEP": "MONEDA",
    "Fondos / PESOS": "FONDOS",
  };

  let posTotal = 0;
  const dataTable = [];
  Object.keys(posicion || {}).forEach((disponibilidad) => {
    let dispTotal = 0;
    const dataDisponibilidad = Object.keys(posicion[disponibilidad] || [])
      .sort((a, b) => (tipoData[a]?.order < tipoData[b]?.order ? -1 : 1))
      .map((cat) => {
        let catTotal = 0;
        const papeles = posicion[disponibilidad][cat]
          .sort((a, b) =>
            a.codigoCV !== b.codigoCV ? (a.codigoCV > b.codigoCV ? 1 : -1) : a.descripcion > b.descripcion ? 1 : -1
          )
          .map((row) => {
            catTotal += row.montoPesos;
            return {
              cells: [
                { className: "text-center", content: tipoNombre[row.tipo] || row.tipo },
                { className: "text-center", content: row.descripcion },
                { className: "text-right", content: tipoData[cat]?.name === "Especies" ? row.codigoCV : "-" },
                { className: "text-center", content: row.abreviatura },
                { className: "text-right", content: row.cantidad.format(), order: row.cantidad },
                { className: "text-right", content: row.precio.format(), order: row.precio },
                {
                  className: "text-center",
                  content: (new Date(row.fecha).getFullYear() > 1900 ? new Date(row.fecha) : new Date()).format(),
                },
                {
                  className: "text-right",
                  content: row.moneda + " " + row.monto.format(),
                  order: row.monto,
                },
                {
                  className: "text-right",
                  content: "$ " + row.montoPesos.format(),
                  order: row.montoPesos,
                },
              ],
            };
          });
        dispTotal += catTotal;
        return [
          {
            className: "separator sub-separator",
            cells: [
              { content: tipoData[cat]?.name || cat, colspan: 8 },
              { className: "text-right", content: catTotal.format() },
            ],
          },
          ...papeles,
        ];
      })
      .flat();
    posTotal += dispTotal;
    if (dataDisponibilidad.length > 0)
      dataTable.push(
        {
          className: "separator",
          cells: [
            { colspan: 8, content: disponibilidad === "disp" ? "Cartera Disponible" : "Cartera No Disponible" },
            { className: "text-right", content: dispTotal.format() },
          ],
        },
        ...dataDisponibilidad
      );
  });

  if (dataTable.length > 0)
    dataTable.push({
      className: "separator main-separator",
      cells: [
        { colspan: 8, content: "Total" },
        { className: "text-right", content: posTotal.format() },
      ],
    });

  return (
    <>
      {dataTable?.length > 0 && (
        <Card style={{ marginTop: 15 }}>
          <Table
            reference={tablaPosicion}
            className="position"
            columns={[
              { content: "Tipo" },
              { content: "Concepto" },
              { className: "text-right", content: "Código" },
              { className: "text-center", content: "Abreviatura" },
              { className: "text-right", content: "Cantidad" },
              { className: "text-right", content: "Cotizacón" },
              { className: "text-center", content: "Fecha Cot." },
              { className: "text-right", content: "Monto" },
              { className: "text-right", content: "Monto Pesos" },
            ]}
            data={dataTable}
          />
        </Card>
      )}
      {dataTable?.length === 0 && (
        <h4 style={{ color: "#808080", textAlign: "center", marginTop: 40 }}>
          {loading ? "No tiene una Posición" : "Cargando Posición"}
        </h4>
      )}

      {dataTable.length > 0 && <Copy style={{ marginTop: 10 }} reference={tablaPosicion} />}
    </>
  );
};

export default Posicion;
