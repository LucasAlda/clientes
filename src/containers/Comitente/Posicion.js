import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import { Table } from "../../components/Table";
const posicionJSON = [
  {
    COMITENTE: 12406,
    DISP: "Cartera Disponible",
    TIPO_ESPECIE: "ACCIONES",
    COD_ESPECIE: 7,
    ESPECIE: "ALUAR",
    ABREVIATURA: "ALUA",
    CANTIDAD: 415989.0,
    COTIZACION: 48.0,
    FEC_COT: "2021-01-29T03:00:00.000Z",
    MONTO: 19967472.0,
    MONTO_PESOS: 19967472.0,
    AccionesXLote: 1.0,
  },
  {
    COMITENTE: 12406,
    DISP: "Cartera Disponible",
    TIPO_ESPECIE: "ACCIONES",
    COD_ESPECIE: 322,
    ESPECIE: "CENTRAL PUERTO",
    ABREVIATURA: "CEPU",
    CANTIDAD: 86927.0,
    COTIZACION: 33.95,
    FEC_COT: "2021-01-29T03:00:00.000Z",
    MONTO: 2951171.65,
    MONTO_PESOS: 2951171.65,
    AccionesXLote: 1.0,
  },
  {
    COMITENTE: 12406,
    DISP: "Cartera Disponible",
    TIPO_ESPECIE: "ACCIONES",
    COD_ESPECIE: 386,
    ESPECIE: "CENTRAL COSTANERA",
    ABREVIATURA: "CECO2",
    CANTIDAD: 20185.0,
    COTIZACION: 13.3,
    FEC_COT: "2021-01-29T03:00:00.000Z",
    MONTO: 268460.5,
    MONTO_PESOS: 268460.5,
    AccionesXLote: 1.0,
  },
  {
    COMITENTE: 12406,
    DISP: "Cartera Disponible",
    TIPO_ESPECIE: "ACCIONES",
    COD_ESPECIE: 725,
    ESPECIE: "GRUPO FINANCIERO VALORES",
    ABREVIATURA: "VALO",
    CANTIDAD: 1000.0,
    COTIZACION: 27.15,
    FEC_COT: "2021-01-29T03:00:00.000Z",
    MONTO: 27150.0,
    MONTO_PESOS: 27150.0,
    AccionesXLote: 1.0,
  },
  {
    COMITENTE: 12406,
    DISP: "Cartera Disponible",
    TIPO_ESPECIE: "ACCIONES",
    COD_ESPECIE: 839,
    ESPECIE: "TERNIUM ARGENTINA",
    ABREVIATURA: "TXAR",
    CANTIDAD: 170914.0,
    COTIZACION: 48.3,
    FEC_COT: "2021-01-29T03:00:00.000Z",
    MONTO: 8255146.2,
    MONTO_PESOS: 8255146.2,
    AccionesXLote: 1.0,
  },
  {
    COMITENTE: 12406,
    DISP: "Cartera Disponible",
    TIPO_ESPECIE: "MONEDA",
    COD_ESPECIE: 7000,
    ESPECIE: '"DOLARES - AMORTIZACION Y RENTA EN EL EXTERIOR"',
    ABREVIATURA: "7000",
    CANTIDAD: 6909.69,
    COTIZACION: 70.2,
    FEC_COT: "2020-06-30T03:00:00.000Z",
    MONTO: 485060.24,
    MONTO_PESOS: 485060.238,
    AccionesXLote: 1.0,
  },
  {
    COMITENTE: 12406,
    DISP: "Cartera Disponible",
    TIPO_ESPECIE: "ACCIONES",
    COD_ESPECIE: 30038,
    ESPECIE: "BOLSAS Y MERCADOS ARGENTINOS (BYMA)",
    ABREVIATURA: "BYMA",
    CANTIDAD: 102.0,
    COTIZACION: 595.5,
    FEC_COT: "2021-01-29T03:00:00.000Z",
    MONTO: 60741.0,
    MONTO_PESOS: 60741.0,
    AccionesXLote: 1.0,
  },
  {
    COMITENTE: 12406,
    DISP: "Cartera Disponible",
    TIPO_ESPECIE: "MONEDA",
    COD_ESPECIE: 0,
    ESPECIE: "PESOS",
    ABREVIATURA: "MON",
    CANTIDAD: -15776779.45,
    COTIZACION: 1.0,
    FEC_COT: "2018-03-12T03:00:00.000Z",
    MONTO: -15776779.45,
    MONTO_PESOS: -15776779.45,
    AccionesXLote: 1.0,
  },
  {
    COMITENTE: 12406,
    DISP: "Cartera Disponible",
    TIPO_ESPECIE: "MONEDA",
    COD_ESPECIE: 0,
    ESPECIE: "DOLAR MEP",
    ABREVIATURA: "MON",
    CANTIDAD: 6141.38,
    COTIZACION: 85.99999982800000034399,
    FEC_COT: "2021-01-29T03:00:00.000Z",
    MONTO: 6141.38,
    MONTO_PESOS: 528158.678944,
    AccionesXLote: 1.0,
  },
  {
    COMITENTE: 12406,
    DISP: "Cartera No Disponible",
    TIPO_ESPECIE: "MONEDA",
    COD_ESPECIE: 0,
    ESPECIE: "PESOS",
    ABREVIATURA: "MON",
    CANTIDAD: 0.01,
    COTIZACION: 1.0,
    FEC_COT: "2018-03-12T03:00:00.000Z",
    MONTO: 0.01,
    MONTO_PESOS: 0.01,
    AccionesXLote: 1.0,
  },
];

const Posicion = ({ match, comitenteId }) => {
  const [posicion, setPosicion] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setPosicion(posicionJSON);
    }, 100);
  }, [comitenteId]);

  const dataTable = posicion.map((row) => ({
    cells: [
      { className: "text-center", content: row.TIPO_ESPECIE },
      { className: "text-center", content: row.ESPECIE },
      { className: "text-right", content: row.COD_ESPECIE },
      { className: "text-center", content: row.ABREVIATURA },
      { className: "text-right", content: row.CANTIDAD.format(), order: row.CANTIDAD },
      { className: "text-right", content: row.COTIZACION.format(), order: row.COTIZACION },
      { className: "text-center", content: new Date(row.FEC_COT).format() },
      { className: "text-right", content: "$ " + row.MONTO.format(), order: row.MONTO },
      { className: "text-right", content: "$ " + row.MONTO_PESOS.format(), order: row.MONTO_PESOS },
    ],
  }));

  return (
    <>
      <Card style={{ marginTop: 10, maxHeight: "calc(100vh - 250px)" }}>
        <Table
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
          tableTotal
          colTotals={[8]}
          data={dataTable}
        />
      </Card>
    </>
  );
};

export default Posicion;
