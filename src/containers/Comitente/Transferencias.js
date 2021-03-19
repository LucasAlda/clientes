import React, { useEffect, useState } from "react";
import { FiFileText, FiTrash2, FiUpload } from "react-icons/fi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { Table } from "../../components/Table";
import Modal from "./ModalDigitalizacion";

import authFetch from "../../helpers/authFetch";
import { useToasts } from "react-toast-notifications";

const Transferencias = ({ match, comitenteId, year, user }) => {
  const { addToast } = useToasts();
  const [data, setData] = useState([]);
  const [modal, setModal] = useState({ show: false, data: {} });

  useEffect(() => {
    authFetch(`/comitente/transferencias/${comitenteId}/${year}`)
      .then((data) => setData(data))
      .catch((err) => {
        addToast("Error al cargar transferencias!", { appearance: "error" });
        console.log(err);
      });
    //eslint-disable-next-line
  }, [comitenteId, year]);

  const handleUpload = (files) => {
    const file = files[0].src ? files[0].src.file : files[0].file.src.file;
    const title = `img/TRANSF/${comitenteId}_${modal.data.TipoTransferencia}_${new Date(modal.data.FECHA).formatDB(
      ""
    )}-${modal.data.Ambito}`;
    const fileType = file.name.split(".")[file.name.split(".").length - 1];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("fileType", fileType);
    formData.append("cod", modal.data.cod);
    formData.append("fecha", new Date(modal.data.FECHA).formatDB());
    formData.append("comitente", comitenteId);
    formData.append("tipoTransferencia", modal.data.TipoTransferencia);
    formData.append("ambito", modal.data.Ambito);
    formData.append("tipoCuenta", modal.data.TipoCuenta);
    formData.append("file", file);
    authFetch("/comitente/transferencias/upload", { method: "POST", body: formData })
      .then((data) => authFetch(`/comitente/transferencias/${comitenteId}/${year}`))
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
        addToast("Error al subir archivo!", { appearance: "error" });
      });
    setModal({ show: false, data: {} });
  };

  const handleDelete = (row) => {
    authFetch(`/comitente/transferencias`, {
      method: "DELETE",
      body: {
        fecha: new Date(row.FECHA).formatDB(),
        comitente: comitenteId,
        tipoTransferencia: row.TipoTransferencia,
        ambito: row.Ambito,
        tipoCuenta: row.TipoCuenta,
      },
    })
      .then((data) => authFetch(`/comitente/transferencias/${comitenteId}/${year}`))
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
        addToast("Error al borrar archivo!", { appearance: "error" });
      });
  };

  const dataTable = [];

  data.forEach((row) => {
    dataTable.push({
      cells: [
        { className: "text-center", content: new Date(row.FECHA).format() },
        { className: "text-center", content: row.TipoTransferencia },
        { className: "text-center", content: row.Ambito },
        { className: "text-center", content: row.TipoCuenta },
        { className: "text-right", style: { paddingRight: 50 }, content: row.MontoTotal.format() },
        {
          className: "text-left",
          content: <Acciones row={row} setModal={setModal} handleDelete={handleDelete} user={user} />,
        },
      ],
    });
  });

  return (
    <>
      {dataTable?.length > 0 ? (
        <Card style={{ marginTop: 15 }}>
          <Table
            className="posicions"
            columns={[
              { className: "text-center", content: "Fecha" },
              { className: "text-center", content: "Tipo de Transferencia" },
              { className: "text-center", content: "Ambito" },
              { className: "text-center", content: "Tipo de cuenta" },
              { className: "text-right", style: { paddingRight: 50 }, content: "Monto Total" },
              { className: "text-left", content: "Acciones" },
            ]}
            data={dataTable}
          />
        </Card>
      ) : (
        <h4 style={{ color: "#808080", textAlign: "center", marginTop: 40 }}>No tiene Transferencias en {year}</h4>
      )}
      <Modal modal={modal} setModal={setModal} title={"Subir Archivo"} handleSubmit={handleUpload} />
    </>
  );
};

const Acciones = ({ row, setModal, user, handleDelete }) => {
  return (
    <>
      {row.LINK ? (
        <Button
          icon
          size="xs"
          color="green"
          onClick={() => window.open("https://exe.aldazabal.com.ar/clientes/" + row.LINK, "_blank")}
        >
          <FiFileText />
        </Button>
      ) : (
        <Button icon size="xs" onClick={() => setModal({ show: true, data: row })}>
          <FiUpload style={{ strokeWidth: 3 }} />
        </Button>
      )}
      {row.LINK && user.tipo === "ADMINISTRADOR" && (
        <Button size="xs" icon color="red" onClick={() => handleDelete(row)}>
          <FiTrash2 />
        </Button>
      )}
    </>
  );
};

export default Transferencias;
