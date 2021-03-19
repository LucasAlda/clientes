import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import { Table } from "../../components/Table";
import authFetch from "../../helpers/authFetch";

const Caucionable = ({ match, comitenteId }) => {
  const [{ hoy = {}, data = [] }, setCaucionable] = useState([]);

  useEffect(() => {
    authFetch(`/comitente/caucionable/${comitenteId}`)
      .then((data) => setCaucionable(data))
      .catch((err) => {
        console.log(err);
      });
  }, [comitenteId]);

  const tipoEspecies = [];

  let TIPO_ESPECIE = "";
  let COD_ESPECIE = "";
  let SALDO_INICIAL_ANT = false;
  let FECHA = "";

  let totalCant = 0;
  let totalMonto = 0;

  data.forEach((row) => {
    if (row.FECHA !== FECHA) {
      if (!SALDO_INICIAL_ANT && COD_ESPECIE !== "") {
        tipoEspecies[tipoEspecies.length - 1].especies[
          tipoEspecies[tipoEspecies.length - 1].especies.length - 1
        ].table.push({
          className: "separator sub-separator",
          cells: [
            { content: `Saldo al ${new Date(FECHA).format()}`, colspan: 2 },
            { className: "text-right", content: totalCant.format() },
            { className: "text-right", content: totalMonto.format(), colspan: 3 },
          ],
        });
      }
      FECHA = row.FECHA;
    }

    if (row.TIPO_ESPECIE !== TIPO_ESPECIE) {
      TIPO_ESPECIE = row.TIPO_ESPECIE;
      tipoEspecies.push({ TIPO_ESPECIE: row.TIPO_ESPECIE, especies: [] });
    }

    if (row.COD_ESPECIE !== COD_ESPECIE) {
      if (SALDO_INICIAL_ANT && COD_ESPECIE !== "") {
        tipoEspecies[tipoEspecies.length - 1].especies[
          tipoEspecies[tipoEspecies.length - 1].especies.length - 1
        ].table.push({
          className: "separator sub-separator",
          cells: [
            { content: `Saldo al ${new Date(FECHA).format()}`, colspan: 2 },
            { className: "text-right", content: totalCant.format() || 0 },
            { className: "text-right", content: totalMonto.format() || 0, colspan: 3 },
          ],
        });
      }

      COD_ESPECIE = row.COD_ESPECIE;
      totalCant = 0;
      totalMonto = 0;

      tipoEspecies[tipoEspecies.length - 1].especies.push({
        ESPECIE: row.ESPECIE,
        COD_ESPECIE: row.COD_ESPECIE,
        table: [],
      });

      if (row.Origen !== "SALDO_INICIAL") {
        SALDO_INICIAL_ANT = true;

        tipoEspecies[tipoEspecies.length - 1].especies[
          tipoEspecies[tipoEspecies.length - 1].especies.length - 1
        ].table.push({
          className: "separator",
          cells: [
            { content: "Saldo Anterior", colspan: 2 },
            { className: "text-right", content: (0).format() },
            { className: "text-center", content: (0).format() },
            { className: "text-right", content: (0).format(), colspan: 2 },
          ],
        });
      }
    }

    totalCant += row.CANTIDAD;
    totalMonto += row.CANTIDAD * row.Cotizacion * row.Aforo;

    if (row.Origen === "SALDO_INICIAL") {
      SALDO_INICIAL_ANT = true;

      tipoEspecies[tipoEspecies.length - 1].especies[
        tipoEspecies[tipoEspecies.length - 1].especies.length - 1
      ].table.push({
        className: "separator",
        cells: [
          { content: "Saldo Anterior", colspan: 2 },
          { className: "text-right", content: row.CANTIDAD.format() },
          { className: "text-center", content: row.Aforo.format() },
          { className: "text-right", content: (row.CANTIDAD * row.Cotizacion * row.Aforo).format(), colspan: 2 },
        ],
      });
    } else {
      SALDO_INICIAL_ANT = false;

      tipoEspecies[tipoEspecies.length - 1].especies[
        tipoEspecies[tipoEspecies.length - 1].especies.length - 1
      ].table.push({
        cells: [
          { className: "text-center", content: new Date(FECHA).format() },
          { content: row.Origen },
          { className: "text-right", content: row.CANTIDAD.format() },
          { className: "text-center", content: row.Aforo.format() },
          { className: "text-right", content: totalCant.format() },
          { className: "text-right", content: (row.CANTIDAD * row.Cotizacion * row.Aforo).format() },
        ],
      });
    }
  });

  console.log(hoy);

  tipoEspecies[tipoEspecies.length - 1]?.especies[
    tipoEspecies[tipoEspecies.length - 1]?.especies.length - 1
  ].table.push({
    className: "separator sub-separator",
    cells: [
      { content: `Saldo al ${new Date(FECHA).format()}`, colspan: 2 },
      { className: "text-right", content: totalCant.format() },
      { className: "text-right", content: totalMonto.format(), colspan: 3 },
    ],
  });

  return (
    <>
      <Card style={{ margin: "20px auto 0 auto", maxWidth: 600 }}>
        <Table
          columns={[
            { className: "text-right", content: "Monto Pesos" },
            { className: "text-right", content: "Caucionado Hoy" },
            { className: "text-right", content: "Saldo" },
          ]}
          data={[
            {
              cells: [
                { className: "text-right", content: (hoy.MONTO_PESOS || 0).format() || "-" },
                { className: "text-right", content: (hoy.CAUCIONADO_HOY || 0).format() || "-" },
                {
                  className: "text-right",
                  content: ((hoy.MONTO_PESOS || 0) + (hoy.CAUCIONADO_HOY || 0)).format() || "0,00",
                },
              ],
            },
          ]}
        />
      </Card>
      {tipoEspecies?.length > 0 &&
        tipoEspecies.map((a, i) => (
          <React.Fragment key={i}>
            {!true && <h3 style={{ marginTop: 15, marginBottom: -10 }}>{a.TIPO_ESPECIE}</h3>}
            {a.especies.map((b, j) => {
              return (
                <React.Fragment key={j}>
                  <h4 style={{ marginTop: 15, marginBottom: 5, color: "rgba(87 87 87 / 80%)" }}>
                    {b.COD_ESPECIE} / {b.ESPECIE}
                  </h4>
                  <Card>
                    <Table
                      className="caucionable"
                      columns={
                        i + j === 0
                          ? [
                              { className: "text-center", content: "Fecha" },
                              { className: "text-left", content: "Descripción" },
                              { className: "text-right", content: "Cantidad VN" },
                              { className: "text-center", content: "Aforo" },
                              { className: "text-right", content: "Saldo" },
                              { className: "text-right", content: "Monto Caucionable" },
                            ]
                          : []
                      }
                      data={b.table}
                    />
                  </Card>
                </React.Fragment>
              );
            })}
          </React.Fragment>
        ))}
    </>
  );
};

export default Caucionable;
