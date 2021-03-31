import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import { Table } from "../../components/Table";
import authFetch from "../../helpers/authFetch";

const Corriente = ({ match, comitenteId, year }) => {
  const [{ loading, corriente }, setCorriente] = useState({ loading: true, corriente: [] });

  useEffect(() => {
    const today = new Date();
    let nextMonth;
    if (today.getMonth() === 11)
      nextMonth = new Date(today.getFullYear() + 1, 1, today.getDate() > 28 ? 28 : today.getDate());
    else nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate() > 28 ? 28 : today.getDate());

    console.log(nextMonth);

    authFetch(`/comitente/corriente/`, {
      method: "POST",
      body: {
        comitenteId,
        desde: new Date().toOldString(),
        hasta: nextMonth.toOldString(),
      },
    })
      .then((data) => setCorriente({ loading: false, corriente: data }))
      .catch((err) => {
        console.log(err);
      });
  }, [comitenteId]);

  const dataTable = [];

  corriente.forEach((row, i) => {
    if (!row.esDisponible || row.esSaldo) return;
    let especieIndex = dataTable.findIndex((a) => a.instrumento === row.instrumento);
    if (especieIndex < 0) {
      dataTable.push({
        lastFecha: "",
        saldoAnt: true,
        instrumento: row.instrumento,
        codigoEspecie: row.codigoEspecie,
        table: [],
      });
      especieIndex = dataTable.length - 1;
    }

    if (dataTable[especieIndex].lastFecha !== row.fechaLiquidacion && !dataTable[especieIndex].saldoAnt) {
      dataTable[especieIndex].table.push({
        className: "separator sub-separator",
        cells: [
          {
            content:
              "Saldo al " +
              new Date(
                dataTable[especieIndex].table[dataTable[especieIndex].table.length - 1].row.fechaLiquidacion.replace(
                  " ",
                  "T"
                )
              ).format(),
          },
          { content: "" },
          ...(row.tipoItem === "Monedas" ? [{ content: "" }] : []),
          {
            className: "text-right",
            content: (dataTable[especieIndex].table[dataTable[especieIndex].table.length - 1].row.saldo || 0).format(),
          },
          ...(row.tipoItem !== "Monedas" ? [{ content: "" }] : []),
          { content: "" },
          { content: "" },
        ],
      });
    }

    if (row.esSaldoAnterior) {
      dataTable[especieIndex].table.push({
        row,
        className: "separator ",
        cells: [
          { content: row.detalle },
          { content: "" },
          ...(row.tipoItem === "Monedas" ? [{ content: "" }] : []),
          {
            className: "text-right",
            content: (row.saldo || 0).format(),
          },
          ...(row.tipoItem !== "Monedas" ? [{ content: "" }] : []),
          { content: "" },
          { content: "" },
        ],
      });
    } else {
      dataTable[especieIndex].saldoAnt = false;
      dataTable[especieIndex].lastFecha = row.fechaLiquidacion;
      dataTable[especieIndex].table.push({
        row,
        cells: [
          {
            className: "text-center",
            content: row.fechaLiquidacion ? new Date(row.fechaLiquidacion.replace(" ", "T")).format() : "",
          },
          { content: row.detalle },
          { className: "text-right", content: (row.cantidadVN || 0).format(), order: row.cantidadVN },
          { className: "text-right", content: (row.importeNeto || 0).format(), order: row.importeNeto || 0 },
          { className: "text-right", content: (row.saldo || 0).format(), order: row.saldo },
          { className: "text-right", content: (row.porcArancel || 0).format(), order: row.porcArancel },
        ],
      });
    }
  });

  dataTable.forEach((especie) => {
    const lastRow = especie.table[especie.table.length - 1].row;
    especie.table.push({
      className: "separator sub-separator",
      cells: [
        {
          content:
            "Saldo al " +
            new Date(lastRow?.fechaLiquidacion ? lastRow.fechaLiquidacion.replace(" ", "T") : new Date()).format(),
        },
        { content: "" },
        ...(lastRow.tipoItem === "Monedas" ? [{ content: "" }] : []),
        {
          className: "text-right",
          content: (especie.table[especie.table.length - 1].row.saldo || 0).format(),
        },
        ...(lastRow.tipoItem !== "Monedas" ? [{ content: "" }] : []),
        { content: "" },
        { content: "" },
      ],
    });
  });

  return (
    <>
      {corriente.length > 0 ? (
        dataTable.map((b, j) => {
          return (
            <React.Fragment key={j}>
              <h4 style={{ marginTop: 15, marginBottom: 5, color: "rgba(87 87 87 / 80%)" }}>{b.instrumento}</h4>
              <Card>
                <Table
                  className="corriente"
                  columns={
                    j === 0
                      ? [
                          { className: "text-center", content: "Fecha" },
                          { className: "text-left", content: "Descripción" },
                          { className: "text-right", content: "Cantidad VN" },
                          { className: "text-right", content: "Neto" },
                          { className: "text-right", content: "Saldo" },
                          { className: "text-right", content: "Arancel (%)" },
                        ]
                      : []
                  }
                  data={b.table}
                />
              </Card>
            </React.Fragment>
          );
        })
      ) : (
        <h4 style={{ color: "#808080", textAlign: "center", marginTop: 40 }}>
          {loading ? "Cargando Cuenta Corriente" : "No hay Cuenta Corriente"}
        </h4>
      )}
    </>
  );
};

export default Corriente;
