import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import { Table } from "../../components/Table";
import Button from "../../components/Button";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ModalCuentas from "./ModalCuentas";
import { confirmAlert } from "../../components/Confirm";
import authFetch from "../../helpers/authFetch";

const personas = [
  {
    nombre: "ALDAZABAL PABLO MANUEL",
    tel: "",
    mail: "p.aldazabal@fibertel.com.ar",
    condicion: "Beneficiario Final",
    cuit: "201034865",
    estado: 1,
  },
  {
    nombre: "ALDAZABAL RAFAEL PABLO ENRIQUE",
    tel: "15-5421-5008",
    mail: "rafael@aldazabal.sba.com.ar",
    condicion: "Beneficiario Final",
    cuit: "20044066247",
    estado: 1,
  },
  {
    nombre: "ALDAZABAL Y CIA S.A.",
    tel: "4394-4428",
    mail: "exequiel@aldazabal.com.ar",
    condicion: "Titular",
    cuit: "30696146396",
    estado: 1,
  },
  {
    nombre: "ALVAREZ ROBERTO",
    tel: "4804-8761",
    mail: "alvarezroberto@fibertel.com.ar",
    condicion: "Beneficiario Final",
    cuit: "20113625113",
    estado: 1,
  },
  {
    nombre: "ALDAZABAL PABLO MANUEL",
    tel: "",
    mail: "p.aldazabal@fibertel.com.ar",
    condicion: "Autorizado",
    cuit: "201034865",
    estado: 1,
  },
  {
    nombre: "ALDAZABAL RAFAEL PABLO ENRIQUE",
    tel: "15-5421-5008",
    mail: "rafael@aldazabal.sba.com.ar",
    condicion: "Autorizado",
    cuit: "20044066247",
    estado: 1,
  },
  {
    nombre: "ALDAZABAL EXEQUIEL RAFAEL",
    tel: "4813-3609 / 155-626-0810",
    mail: "exequiel@somospalta.com",
    condicion: "Autorizado",
    cuit: "20293197750",
    estado: -1,
  },
];

const cuentas = [
  {
    ID_CUENTA: 1,
    CUIT: "30696146396",
    MONEDA: "PESOS",
    CBU: "0170508920000000027335",
    BANCO: "FRANCES",
    TIPO_CUENTA: "Cuenta Corriente",
  },
  {
    ID_CUENTA: 2,
    CUIT: "30696146396",
    MONEDA: "PESOS",
    CBU: "0170508920000000027267",
    BANCO: "FRANCES",
    TIPO_CUENTA: "Cuenta GASTOS",
  },
  {
    ID_CUENTA: 3,
    CUIT: "30696146396",
    MONEDA: "DOLAR MEP",
    CBU: "0170508926000000005753",
    BANCO: "FRANCES",
    TIPO_CUENTA: "Cuenta Corriente",
  },
  {
    ID_CUENTA: 4,
    CUIT: "30696146396",
    MONEDA: "PESOS",
    CBU: "1980001730000000000179",
    BANCO: "VALORES",
    TIPO_CUENTA: "Cuenta Corriente 1/7",
  },
];

const Info = ({ match, comitenteId }) => {
  const [verTodos, setVerTodos] = useState(false);
  const [personaActiva, setPersonaActiva] = useState(false);
  const [modal, setModal] = useState({ show: false, action: "ADD", data: {} });

  const handleSubmit = (formData) => {
    switch (modal.action) {
      case "ADD":
        console.log(formData);
        break;

      default:
        break;
    }
  };

  const handleBorrarCuenta = (row) => {};

  const dataTable = (verTodos ? personas : personas.filter((per) => per.estado === 1)).map((row) => ({
    className: row.estado === 1 ? "" : "text-red",
    handleClick: () => setPersonaActiva(row.cuit),
    cells: [
      { content: row.nombre },
      { content: row.tel },
      { content: row.mail },
      { content: row.condicion },
      { content: row.cuit },
    ],
  }));

  const dataTableCuentas = cuentas.map((row) => ({
    className: personaActiva === row.CUIT ? "text-bold" : "",
    cells: [
      { content: row.CUIT },
      { content: row.MONEDA },
      { content: row.CBU },
      { content: row.BANCO },
      { content: row.TIPO_CUENTA },
      {
        content: (
          <>
            <Button icon size="xs" color="green" onClick={() => setModal({ action: "EDIT", show: true, data: row })}>
              <FiEdit style={{ width: 20, height: 20 }} />
            </Button>
            <Button
              icon
              size="xs"
              color="red"
              onClick={() =>
                confirmAlert({
                  title: `Eliminar Banco`,
                  message: `Borrar ${row.BANCO} (${row.TIPO_CUENTA}) ${row.CBU}`,
                  buttons: [
                    {
                      label: "Confirmar",
                      onClick: () => handleBorrarCuenta(row),
                    },
                    {
                      label: "Cancelar",
                      onClick: () => {},
                      color: "transparent",
                    },
                  ],
                })
              }
            >
              <FiTrash2 style={{ width: 20, height: 20 }} />
            </Button>
          </>
        ),
      },
    ],
  }));

  useEffect(() => {
    authFetch("/example/ping").then((data) => console.log(data));
  }, []);

  return (
    <>
      <h4 style={{ marginBottom: 0, marginTop: 15 }}>Titulares y Autorizados</h4>
      <Card style={{ marginTop: 10, height: "calc((100vh - 300px) / 2 - 30px)" }}>
        <Table
          columns={[
            { className: "text-left", content: "Persona" },
            { className: "text-left", content: "Telefono" },
            { className: "text-left", content: "Mail" },
            { className: "text-left", content: "Condición" },
            { className: "text-left", content: "CUIT" },
          ]}
          data={dataTable}
        />
      </Card>
      <label
        style={{
          display: "inline-flex",
          float: "right",
          position: "relative",
          marginTop: "-20px",
          top: 25,
          alignItems: "center",
        }}
      >
        <input
          type="checkbox"
          style={{ width: "auto" }}
          value={verTodos}
          onClick={() => setVerTodos((prev) => !prev)}
        />
        Ver Todos
      </label>
      <h4 style={{ marginBottom: 0 }}>
        Cuentas Bancarias{" "}
        <Button
          size="xs"
          style={{ marginLeft: 10 }}
          onClick={() => setModal({ action: "ADD", show: true, data: { comitente: comitenteId } })}
        >
          Agregar Cuenta
        </Button>
      </h4>
      <Card style={{ marginTop: 10, height: "calc((100vh - 300px) / 2 - 30px)" }}>
        <Table
          columns={[
            { className: "text-left", content: "CUIT" },
            { className: "text-left", content: "Moneda" },
            { className: "text-left", content: "CBU" },
            { className: "text-left", content: "Banco" },
            { className: "text-left", content: "Tipo Cuenta" },
            { className: "text-left", content: "Acciones" },
          ]}
          data={dataTableCuentas}
        />
      </Card>
      <ModalCuentas modal={modal} setModal={setModal} handleSubmit={handleSubmit} />
    </>
  );
};

export default Info;
