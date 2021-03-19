import React, { useEffect, useState } from "react";
import { FiFileText, FiTrash2, FiMail } from "react-icons/fi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { Table } from "../../components/Table";
import authFetch from "../../helpers/authFetch";
import Modal from "./ModalFacturas";
import { useToasts } from "react-toast-notifications";
import { confirmAlert } from "../../components/Confirm";

const Facturas = ({ match, comitenteId, user, year }) => {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState({ show: false, data: {} });
  const { addToast } = useToasts();

  useEffect(() => {
    authFetch(`/proveedor/facturas/${comitenteId}/${year}`)
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
      });
  }, [comitenteId, year]);

  console.log(data);

  const handleUpload = (files) => {
    const file = files[0].src ? files[0].src.file : files[0].file.src.file;
    const title = `img/FAC/${modal.data.PROVEEDOR}_${modal.data.Punto_Vta}-${modal.data.Nro_Fac}`;
    const fileType = file.name.split(".")[file.name.split(".").length - 1];
    const formData = new FormData();
    formData.append("title", title);
    formData.append("fileType", fileType);
    formData.append("where", modal.data.where);
    formData.append("cod", modal.data.CodFacturaMov);
    formData.append("file", file);
    authFetch("/proveedor/facturas/upload", { method: "POST", body: formData })
      .then((data) => authFetch(`/proveedor/facturas/${comitenteId}/${year}`))
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
        addToast("Error al subir archivo!", { appearance: "error" });
      });
    setModal({ show: false, data: {} });
  };

  const handleDelete = (row) => {
    confirmAlert({
      title: "Borrar Documento",
      message: "Eliminar Documento " + (row.EXTRA || row.DESCRIPCION),
      buttons: [
        {
          label: "Borrar",
          onClick: () => {
            authFetch(`/proveedor/facturas/${row.CodFacturaMov}`, { method: "DELETE" })
              .then((data) => authFetch(`/proveedor/facturas/${comitenteId}/${year}`))
              .then((data) => setData(data))
              .catch((err) => {
                console.log(err);
                addToast("Error al borrar archivo!", { appearance: "error" });
              });
          },
        },
        { label: "Cancelar", onClick: () => {}, color: "transparent" },
      ],
    });
  };

  const dataTable = [];

  data.forEach((row) => {
    dataTable.push({
      cells: [
        { className: "text-center", content: new Date(row.FechaEmision).format() },
        { className: "text-left", content: row.CodTpFacturaMov },
        { className: "text-left", content: row.CodTpFactura },
        { className: "text-center", content: row.Punto_Vta },
        { className: "text-center", content: row.Nro_Fac },
        {
          className: "text-right",
          style: { paddingRight: 40 },
          content: row.Importe_Total.format(),
          order: row.Importe_Total,
        },
        {
          className: "text-left",
          content: <Acciones row={row} user={user} handleDelete={handleDelete} setModal={setModal} />,
        },
      ],
    });
  });

  return (
    <>
      <h4 style={{ marginTop: 15, marginBottom: 0, display: "flex", alignItems: "center" }}>Facturas</h4>
      {dataTable?.length > 0 && (
        <Card style={{ marginTop: 10 }}>
          <Table
            className="posicions"
            columns={[
              { className: "text-center", content: "Fecha Emisión" },
              { className: "text-left", content: "Tipo Mov. Fac." },
              { className: "text-left", content: "Cod. Tipo Fac." },
              { className: "text-center", content: "Punto" },
              { className: "text-center", content: "Nro Factura" },
              { className: "text-right", content: "Importe Total", style: { paddingRight: 40 } },
              { className: "text-left", content: "Acciones" },
            ]}
            data={dataTable}
          />
        </Card>
      )}
      <Modal modal={modal} setModal={setModal} handleSubmit={handleUpload} title="SubirArchivo" />
    </>
  );
};

const Acciones = ({ row, user, handleDelete, setModal }) => {
  return (
    <>
      {row.esco ? (
        <Button
          size="xs"
          color="green"
          onClick={() => window.open("https://exe.aldazabal.com.ar/clientes/" + row.esco, "_blank")}
        >
          Esco
        </Button>
      ) : (
        <Button size="xs" color="dark" onClick={() => setModal({ show: true, data: { where: "esco", ...row } })}>
          Esco
        </Button>
      )}
      {row.banco ? (
        <Button
          size="xs"
          color="green"
          onClick={() => window.open("https://exe.aldazabal.com.ar/clientes/" + row.banco, "_blank")}
        >
          Banco
        </Button>
      ) : (
        <Button size="xs" color="dark" onClick={() => setModal({ show: true, data: { where: "banco", ...row } })}>
          Banco
        </Button>
      )}
      {row.link && (
        <Button
          icon
          size="xs"
          color="green"
          onClick={() => window.open("https://exe.aldazabal.com.ar/clientes/" + row.link, "_blank")}
        >
          <FiFileText />
        </Button>
      )}
      {(row.esco || row.banco || row.link) && (
        <Button size="xs" icon color={row.mail ? "yellow" : "primary"}>
          <FiMail
            className="mail"
            style={{
              strokeWidth: 1,
              fill: row.mail ? "#575757" : "#fff",
              color: row.mail ? "rgb(255 202 40)" : "hsl(220, 80%, 60%)",
              height: 20,
              width: 20,
            }}
          />
        </Button>
      )}
      {(row.esco || row.banco || row.link) && user.tipo === "ADMINISTRADOR" && (
        <Button size="xs" icon color="red" onClick={() => handleDelete(row)}>
          <FiTrash2 />
        </Button>
      )}
    </>
  );
};

export default Facturas;
