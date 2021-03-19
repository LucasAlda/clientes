import React, { useEffect, useState } from "react";
import { Table } from "../../components/Table";
import authFetch from "../../helpers/authFetch";

const Mercado = ({ history, show, type }) => {
  const [mercadoData, setMercado] = useState({ type: "", data: {} });
  const { data } = mercadoData;

  useEffect(() => {
    if (show)
      authFetch(`/bottom/${type}`)
        .then((data) => setMercado({ type, data: data }))
        .catch((err) => console.log(err));
  }, [show, type]);

  const mercado = [];

  const dataTable = [];

  mercado.push({
    style: { backgroundColor: "hsl(220, 20%, 98%)" },
    className: "header",
    title: "Saldo Anterior",
    recibe: data["SALDO ANTERIOR"] > 0 ? data["SALDO ANTERIOR"] : "",
    entrega: data["SALDO ANTERIOR"] <= 0 ? data["SALDO ANTERIOR"] : "",
  });

  if (data["1_RECIBIR_CDO"] || data["6_ENTREGAR_CDO"]) {
    mercado.push({
      title: "CN - Contado",
      recibe: data["1_RECIBIR_CDO"],
      entrega: -data["6_ENTREGAR_CDO"],
    });
  }

  if (data["C"] || data["V"]) {
    mercado.push({
      title: "FC - Cauc.Pase INM.",
      recibe: data["C"],
      entrega: -data["V"],
    });
  }

  if (data["3_RECIBIR_FNF"] || data["8_ENTREGAR_FNF"]) {
    mercado.push({
      title: "FV - Cauc.Pase Vto.",
      recibe: data["3_RECIBIR_FNF"],
      entrega: -data["8_ENTREGAR_FNF"],
    });
  }

  if (data["Otros_Egresos"]) {
    mercado.push({
      title: "Otros Egresos",
      recibe: 0,
      entrega: data["Otros_Egresos"],
    });
  }

  if (data["Anticipo"]) {
    mercado.push({
      title: "Anticipo",
      recibe: data["Anticipo"] > 0 ? data["Anticipo"] : 0,
      entrega: data["Anticipo"] <= 0 ? data["Anticipo"] : 0,
    });
  }

  if (data["Varios"]) {
    mercado.push({
      title: "Varios",
      recibe: data["Varios"] > 0 ? data["Varios"] : 0,
      entrega: data["Varios"] <= 0 ? data["Varios"] : 0,
    });
  }

  if (data["11_ENTREGA_PRF"]) {
    mercado.push({
      title: "PR/F",
      recibe: 0,
      entrega: -data["11_ENTREGA_PRF"],
    });
  }

  if (data["2_RECIBIR_OPCION"] || data["7_ENTREGAR_OPCION"]) {
    mercado.push({
      title: "OP - Opciones",
      recibe: data["2_RECIBIR_OPCION"],
      entrega: -data["7_ENTREGAR_OPCION"],
    });
  }

  if (data["Liq._Perdidas_Ganancias_FUTDIV"]) {
    mercado.push({
      title: "FUTDIV",
      recibe: data["Liq._Perdidas_Ganancias_FUTDIV"],
      entrega: 0,
    });
  }

  if (data["11_ENTREGAR_LICI/P"]) {
    mercado.push({
      title: "LICI/P",
      recibe: 0,
      entrega: data["11_ENTREGAR_LICI/P"],
    });
  }

  if (data["5_RECIBIR_CDO_INM"] || data["10_ENTREGAR_CDO_INM"]) {
    mercado.push({
      title: "CI - Cdo. Inmediato",
      recibe: data["5_RECIBIR_CDO_INM"],
      entrega: -data["10_ENTREGAR_CDO_INM"],
    });
  }

  let total = 0;
  mercado.forEach((row) => {
    total += (row.entrega || 0) + (row.recibe || 0);
    dataTable.push({
      className: row.className,
      style: row.style,
      cells: [
        { content: row.title },
        { className: "text-right", content: (row.recibe || 0).format() },
        { className: "text-right", content: (row.entrega || 0).format() },
        { className: "text-right", content: ((row.entrega || 0) + (row.recibe || 0)).format() },
      ],
    });
  });

  dataTable.push({
    className: "header",
    cells: [
      { content: "Total", colspan: 3 },
      { className: "text-right", content: total.format() },
    ],
  });

  return (
    <div
      style={{
        display: show && mercadoData.type === type ? "grid" : "none",
        gridTemplateColumns: "4fr 3fr",
        padding: 20,
        gap: 20,
      }}
    >
      <div>
        <div style={{ border: "1px solid hsl(220, 13%, 91%)", borderWidth: "1px 1px 0 1px", borderRadius: 6 }}>
          <Table
            columns={[
              { content: "Tipo" },
              { className: "text-right", content: "Recibe" },
              { className: "text-right", content: "Entrega" },
              { className: "text-right", content: "Neto" },
            ]}
            data={dataTable}
          />
        </div>
      </div>
      <div>
        <div style={{ border: "1px solid hsl(220, 13%, 91%)", borderWidth: "1px 1px 0 1px", borderRadius: 6 }}>
          <Table
            columns={[{ content: "Tipo" }, { className: "text-right", content: "Neto" }]}
            data={[
              { cells: [{ content: "Total" }, { className: "text-right", content: total.format() }] },
              {
                cells: [
                  { content: "Devoluciones Gara" },
                  { className: "text-right", content: (data["Devoluciones_Gara"] || 0).format() },
                ],
              },
              {
                cells: [
                  { content: "Egresos Gara" },
                  { className: "text-right", content: (data["Garantias"] || 0).format() },
                ],
              },
              {
                className: "header",
                cells: [
                  { content: "Neto a LIQ" },
                  {
                    className: "text-right",
                    content: ((total || 0) + (data["Devoluciones_Gara"] || 0) + (data["Garantias"] || 0)).format(),
                  },
                ],
              },
              {
                cells: [
                  { content: "Deposito" },
                  { className: "text-right", content: (data["Deposito"] || 0).format() || "-" },
                ],
              },
              {
                cells: [
                  { content: "Extracción" },
                  { className: "text-right", content: (data["Extraccion"] || 0).format() || "-" },
                ],
              },
              {
                className: "header",
                cells: [
                  {
                    content:
                      (total || 0) +
                        (data["Devoluciones_Gara"] || 0) +
                        (data["Deposito"] || 0) +
                        (data["Extraccion"] || 0) +
                        (data["Garantias"] || 0) >=
                      0
                        ? "A Cobrar"
                        : "A Pagar",
                  },
                  {
                    className: "text-right",
                    content:
                      parseFloat(
                        (
                          (total || 0) +
                          (data["Devoluciones_Gara"] || 0) +
                          (data["Deposito"] || 0) +
                          (data["Extraccion"] || 0) +
                          (data["Garantias"] || 0)
                        ).toFixed(2)
                      ).format() || "0,00",
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Mercado;
