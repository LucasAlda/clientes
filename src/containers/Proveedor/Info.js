import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import { Table } from "../../components/Table";
import Button from "../../components/Button";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ModalCuentas from "../Comitente/ModalCuentas";
import { confirmAlert } from "../../components/Confirm";
import authFetch from "../../helpers/authFetch";
import { useToasts } from "react-toast-notifications";

const Info = ({ comitenteId, user }) => {
  const { addToast } = useToasts();
  const [verTodos, setVerTodos] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [personaActiva, setPersonaActiva] = useState(false);
  const [modal, setModal] = useState({ show: false, action: "ADD", data: {} });

  useEffect(() => {
    Promise.all([
      authFetch(`/proveedor/info/personas/${comitenteId}`),
      authFetch(`/comitente/info/cuentas/${comitenteId}`),
    ])
      .then(([personas, cuentas]) => {
        setPersonas(personas);
        setCuentas(cuentas);
      })
      .catch((err) => addToast("Error cargando información!", { appearance: "error" }));
    //eslint-disable-next-line
  }, [comitenteId]);

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

  const dataTable = (verTodos ? personas : personas.filter((per) => per.COMITENTE_ANULADO === 0)).map((row) => ({
    className: row.COMITENTE_ANULADO === 0 ? "" : "text-red",
    handleClick: () => setPersonaActiva(row.CUIT),
    cells: [
      { content: row.PERSONA },
      { content: row.TEL },
      { content: row.EMAIL },
      { content: row.CONDICION },
      { content: row.CUIT },
    ],
  }));

  const dataTableCuentas = cuentas.map((row) => ({
    className: personaActiva === row.Cuit ? "text-bold" : "",
    cells: [
      { content: row.Cuit },
      { content: row.Moneda },
      { content: row.CBU },
      { content: row.Banco },
      { content: row.TipoCuenta },
      {
        content: (
          <>
            <Button icon size="xs" color="green" onClick={() => setModal({ action: "EDIT", show: true, data: row })}>
              <FiEdit style={{ width: 20, height: 20 }} />
            </Button>
            {user?.tipo === "ADMINISTRADOR" && (
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
            )}
          </>
        ),
      },
    ],
  }));

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
