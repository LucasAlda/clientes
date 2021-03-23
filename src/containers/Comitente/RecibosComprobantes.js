import React, { useEffect, useState } from "react";
import { FiFileText, FiMail, FiTrash2 } from "react-icons/fi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { Table } from "../../components/Table";
import Modal from "./ModalDigitalizacion";
import authFetch from "../../helpers/authFetch";
import { useToasts } from "react-toast-notifications";
import { confirmAlert } from "../../components/Confirm";

const RecibosComprobantes = ({ match, comitenteId, year, user, comitente }) => {
  const { addToast } = useToasts();
  const [data, setData] = useState([]);
  const [modal, setModal] = useState({ show: false, data: {} });

  useEffect(() => {
    authFetch(`/comitente/rec-comp/${comitenteId}/${year}`)
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
        addToast("Error al cargar recibos y comprobantes!", { appearance: "error" });
      });
    //eslint-disable-next-line
  }, [comitenteId, year]);

  const handleUpload = (files) => {
    const file = files[0].src ? files[0].src.file : files[0].file.src.file;
    const title = `img/REC_COMP/${comitenteId}_${modal.data.Tipocomprobante}_${new Date(
      modal.data.fechaconcertacion
    ).formatDB("")}-${modal.data.nrocomprobante}`;

    const fileType = file.name.split(".")[file.name.split(".").length - 1];
    const formData = new FormData();
    formData.append("title", title);
    formData.append("fileType", fileType);
    formData.append("where", modal.data.where);
    formData.append("cod", modal.data.cod);
    formData.append("file", file);
    authFetch("/comitente/rec-comp/upload", { method: "POST", body: formData })
      .then((data) => authFetch(`/comitente/rec-comp/${comitenteId}/${year}`))
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
        addToast("Error al subir archivo!", { appearance: "error" });
      });
    setModal({ show: false, data: {} });
  };

  const handleDelete = (row) => {
    authFetch(`/comitente/rec-comp/${row.cod}`, { method: "DELETE" })
      .then((data) => authFetch(`/comitente/rec-comp/${comitenteId}/${year}`))
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
        addToast("Error al borrar archivo!", { appearance: "error" });
      });
  };

  const handleMail = (row) => {
    confirmAlert({
      title: "Enviar Mail",
      message: `Enviar mail de ${row.Tipocomprobante === "RC" ? "Recibo" : "Comprobante"} por ${(
        row.IMPORTE_TOTAL || 0
      ).format()} ${
        row.codmoneda === 2 ? "DOLAR MEP" : row.codmoneda === 4 ? "DOLAR CABLE" : "PESOS"
      } del dia ${new Date(row.fechaconcertacion).format()}`,
      buttons: [
        {
          label: "Enviar",
          onClick: () => {
            fetch(`https://extras.aldazabal.com.ar/clientes/mail/rec-comp/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                mail: comitente.MAIL,
                tipo: row.Tipocomprobante,
                link: row.link,
                esco: row.esco,
                banco: row.banco,
                denominacion: comitente.NOMBRE_CUENTA,
                comitente: row.numcomitente,
                fecha: row.fechaconcertacion,
                codMoneda: row.codmoneda === 2 ? "DOLAR MEP" : row.codmoneda === 4 ? "DOLAR CABLE" : "PESOS",
                importe: (row.IMPORTE_TOTAL || 0).format(),
                cod: row.codtesoreriamov,
              }),
            })
              .then((data) => authFetch(`/comitente/rec-comp/${comitenteId}/${year}`))
              .then((data) => {
                setData(data);
                addToast(`Mail de ${row.Tipocomprobante === "RC" ? "Recibo" : "Comprobante"} enviado!`, {
                  appearance: "success",
                });
              })
              .catch((err) => {
                console.log(err);
                addToast(`Error enviando mail de ${row.Tipocomprobante === "RC" ? "Recibo" : "Comprobante"}!`, {
                  appearance: "error",
                });
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
        { className: "text-center", content: new Date(row.fechaconcertacion).format() },
        { className: "text-center", content: row.Tipocomprobante },
        {
          className: "text-left",
          content: row.codmoneda === 2 ? "DOLAR MEP" : row.codmoneda === 4 ? "DOLAR CABLE" : "PESOS",
        },
        { className: "text-right", content: row.IMPORTE_TOTAL.format() },
        { className: "text-left", style: { paddingLeft: 30 }, content: row.nrocomprobante },
        { className: "text-right", style: { paddingRight: 30 }, content: row.IMPORTE_PESOS.format() },
        {
          className: "text-left",
          content: (
            <Acciones row={row} setModal={setModal} user={user} handleDelete={handleDelete} handleMail={handleMail} />
          ),
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
              { className: "text-center", content: "Tipo" },
              { className: "text-left", content: "Cod. Moneda" },
              { className: "text-right", content: "Importe Total" },
              { className: "text-left", style: { paddingLeft: 30 }, content: "Comprobante" },
              { className: "text-right", style: { paddingRight: 30 }, content: "Importe Pesos" },
              { className: "text-left", content: "Acciones" },
            ]}
            data={dataTable}
          />
        </Card>
      ) : (
        <h4 style={{ color: "#808080", textAlign: "center", marginTop: 40 }}>
          No tiene Recibos o comprobantes en {year}
        </h4>
      )}
      <Modal modal={modal} setModal={setModal} title={"Subir Archivo"} handleSubmit={handleUpload} />
    </>
  );
};

const Acciones = ({ row, setModal, user, handleDelete, handleMail }) => {
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
        <Button size="xs" icon color={row.mail ? "yellow" : "primary"} onClick={() => handleMail(row)}>
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

export default RecibosComprobantes;
