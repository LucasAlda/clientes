import React, { useEffect, useState } from "react";
import { FiFileText, FiTrash2 } from "react-icons/fi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { Table } from "../../components/Table";
import authFetch from "../../helpers/authFetch";
import Modal from "./ModalDocumentos";
import { confirmAlert } from "../../components/Confirm";

const Documentos = ({ match, comitenteId, user }) => {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState({ show: false, data: {} });

  useEffect(() => {
    authFetch(`/comitente/documentos/${comitenteId}`)
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
      });
  }, [comitenteId]);

  const handleUpload = (data, file) => {
    console.log(data, file);
    const formData = new FormData();
    Object.keys(data).forEach((a) => formData.append(a, data[a]));
    formData.append("comitente", comitenteId);
    formData.append("file", file.src.file);

    authFetch(`/comitente/documentos/upload`, { method: "POST", body: formData })
      .then((data) => authFetch(`/comitente/documentos/${comitenteId}`))
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
      });
    setModal((prev) => ({ ...prev, show: false }));
  };

  const handleDelete = (row) => {
    confirmAlert({
      title: "Borrar Documento",
      message: "Eliminar Documento " + (row.EXTRA || row.DESCRIPCION),
      buttons: [
        {
          label: "Borrar",
          onClick: () => {
            authFetch(`/comitente/documentos/${row.ID}`, { method: "DELETE" })
              .then((data) => authFetch(`/comitente/documentos/${comitenteId}`))
              .then((data) => setData(data))
              .catch((err) => {
                console.log(err);
              });
          },
        },
        { label: "Cancelar", onClick: () => {}, color: "transparent" },
      ],
    });
  };

  const dataTable = [];

  const tiposDoc = {
    1: "Apertura",
    2: "DNI y Constancias AFIP",
    3: "DDJJs AFIP",
    4: "Estatuto",
    5: "Balance",
    6: "Origen de Fondos",
    7: "Documentos Varios",
    8: "Transferencia de titulos",
  };

  data.forEach((row) => {
    let tipo = tiposDoc[row.TIPO_DOC];

    dataTable.push({
      cells: [
        { className: "text-left", content: tipo },
        { className: "text-left", content: row.EXTRA || row.DESCRIPCION },
        { className: "text-center", content: new Date(row.FECHA).format() },
        { className: "text-center", content: new Date(row.FECHA_VENC).format() },
        { className: "text-center", content: new Date(row.FECHA_CARGA).format() },
        { className: "text-left", content: <Acciones row={row} user={user} handleDelete={handleDelete} /> },
      ],
    });
  });

  return (
    <>
      <h4 style={{ marginTop: 15, marginBottom: 0, display: "flex", alignItems: "center" }}>
        Documentos
        <Button style={{ marginLeft: 10 }} size="xs" onClick={() => setModal({ show: true, action: "ADD", data: {} })}>
          Importar
        </Button>
      </h4>
      {dataTable?.length > 0 && (
        <Card style={{ marginTop: 10 }}>
          <Table
            className="posicions"
            columns={[
              { className: "text-left", content: "Tipo" },
              { className: "text-left", content: "Nombre" },
              { className: "text-center", content: "Fecha" },
              { className: "text-center", content: "Vencimiento" },
              { className: "text-center", content: "Fecha Carga" },
              { className: "text-left", content: "Acciones" },
            ]}
            data={dataTable}
          />
        </Card>
      )}
      <Modal modal={modal} setModal={setModal} handleSubmit={handleUpload} />
    </>
  );
};

const Acciones = ({ row, user, handleDelete }) => {
  return (
    <>
      <Button
        icon
        size="xs"
        color="green"
        onClick={() => window.open("https://exe.aldazabal.com.ar/clientes/" + row.LINK, "_blank")}
      >
        <FiFileText />
      </Button>
      {user.tipo === "ADMINISTRADOR" && (
        <Button size="xs" icon color="red" onClick={() => handleDelete(row)}>
          <FiTrash2 />
        </Button>
      )}
    </>
  );
};

export default Documentos;
