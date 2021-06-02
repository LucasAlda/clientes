import React, { useEffect, useRef, useState } from "react";
import { FiFileText, FiMail, FiTrash2 } from "react-icons/fi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { Table } from "../../components/Table";
import Modal from "../Comitente/ModalDigitalizacion";
import authFetch from "../../helpers/authFetch";
import { useToasts } from "react-toast-notifications";
import { confirmAlert } from "../../components/Confirm";
import Copy from "../../components/Copy";
import Input, { SelectInput } from "../../components/Input";

const RecibosComprobantes = ({ match, user }) => {
  const tablaRecComp = useRef(undefined);
  const { addToast } = useToasts();
  const [data, setData] = useState([]);
  const [modal, setModal] = useState({ show: false, data: {} });
  const [year, setYear] = useState(2021);

  useEffect(() => {
    authFetch(`/extras/recibos-comprobantes-rest/${year}`)
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
        addToast("Error al cargar recibos y comprobantes!", { appearance: "error" });
      });
    //eslint-disable-next-line
  }, [year]);

  const handleUpload = (files) => {
    const file = files[0].src ? files[0].src.file : files[0].file.src.file;
    const title = `img/REC_COMP/${modal.data.numcomitente}_${modal.data.Tipocomprobante}_${new Date(
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
      .then((data) => authFetch(`/extras/recibos-comprobantes-rest/${year}`))
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
        addToast("Error al subir archivo!", { appearance: "error" });
      });
    setModal({ show: false, data: {} });
  };

  const dataTable = [];

  data.forEach((row, i) => {
    console.log(row);
    dataTable.push({
      cells: [
        { className: "text-center", style: { fontWeight: 700 }, content: "#" + (i + 1) },
        { className: "text-center", style: { fontWeight: 700 }, content: row.numcomitente },
        { className: "text-center", content: new Date(row.fechaconcertacion).format() },
        { className: "text-center", content: row.Tipocomprobante },
        {
          className: "text-left",
          content: row.codmoneda === 2 ? "DOLAR MEP" : row.codmoneda === 4 ? "DOLAR CABLE" : "PESOS",
        },
        { className: "text-right", content: row.IMPORTE_TOTAL.format(), order: row.IMPORTE_TOTAL },
        { className: "text-left", style: { paddingLeft: 30 }, content: row.nrocomprobante },
        { className: "text-right", content: row.IMPORTE_PESOS.format(), order: row.IMPORTE_PESOS },
        {
          className: "text-left",
          style: { paddingLeft: 30 },
          content: <Acciones row={row} setModal={setModal} user={user} />,
        },
      ],
    });
  });

  return (
    <>
      {dataTable?.length > 0 ? (
        <>
          <div style={{ paddingTop: 20, display: "flex", alignItems: "center" }}>
            <div style={{ width: 150 }}>
              <SelectInput
                onChange={(e) => setYear(e.target.value)}
                value={year}
                data={[
                  { label: "2021", value: "2021" },
                  { label: "2020", value: "2020" },
                  { label: "2019", value: "2019" },
                  { label: "2018", value: "2018" },
                  { label: "2017", value: "2017" },
                  { label: "2016", value: "2016" },
                  { label: "2015", value: "2015" },
                  { label: "2014", value: "2014" },
                  { label: "2013", value: "2013" },
                  { label: "2012", value: "2012" },
                  { label: "2011", value: "2011" },
                  { label: "2010", value: "2010" },
                ]}
              />
            </div>
          </div>
          <Card style={{ marginTop: 15 }}>
            <Table
              reference={tablaRecComp}
              className="posicions"
              columns={[
                { className: "text-center", content: "#" },
                { className: "text-center", content: "Comitente" },
                { className: "text-center", content: "Fecha" },
                { className: "text-center", content: "Tipo" },
                { className: "text-left", content: "Cod. Moneda" },
                { className: "text-right", content: "Importe Total" },
                { className: "text-left", style: { paddingLeft: 30 }, content: "Comprobante" },
                { className: "text-right", content: "Importe Pesos" },
                { className: "text-left", style: { paddingLeft: 30 }, content: "Acciones" },
              ]}
              tableTotal
              colTotals={[5, 7]}
              data={dataTable}
            />
          </Card>
          <Copy style={{ marginTop: 10 }} actions={true} reference={tablaRecComp} />
        </>
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
        <Button
          size="xs"
          color="dark"
          onClick={() => setModal({ show: true, data: { where: "esco", ...row } })}
        >
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
        <Button
          size="xs"
          color="dark"
          onClick={() => setModal({ show: true, data: { where: "banco", ...row } })}
        >
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
    </>
  );
};

export default RecibosComprobantes;
