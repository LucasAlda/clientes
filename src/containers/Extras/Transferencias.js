import React, { useEffect, useState } from "react";
import { FiFileText, FiMail, FiTrash2, FiUpload } from "react-icons/fi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { Table } from "../../components/Table";
import Modal from "../Comitente/ModalDigitalizacion";
import { confirmAlert } from "../../components/Confirm";
import authFetch from "../../helpers/authFetch";
import { useToasts } from "react-toast-notifications";
import { SelectInput } from "../../components/Input";

const Transferencias = ({ match, user }) => {
  const { addToast } = useToasts();
  const [data, setData] = useState([]);
  const [modal, setModal] = useState({ show: false, data: {} });
  const [year, setYear] = useState(2021);

  useEffect(() => {
    authFetch(`/extras/transferencias-rest/${year}`)
      .then((data) => setData(data))
      .catch((err) => {
        addToast("Error al cargar transferencias!", { appearance: "error" });
        console.log(err);
      });
    //eslint-disable-next-line
  }, [year]);

  const handleUpload = (files) => {
    const file = files[0].src ? files[0].src.file : files[0].file.src.file;
    const title = `img/TRANSF/${modal.data.Comitente}_${modal.data.TipoTransferencia}_${new Date(
      modal.data.FECHA
    ).formatDB("")}-${modal.data.Ambito}`;
    const fileType = file.name.split(".")[file.name.split(".").length - 1];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("fileType", fileType);
    formData.append("cod", modal.data.cod);
    formData.append("fecha", new Date(modal.data.FECHA).formatDB());
    formData.append("comitente", modal.data.Comitente);
    formData.append("tipoTransferencia", modal.data.TipoTransferencia);
    formData.append("ambito", modal.data.Ambito);
    formData.append("tipoCuenta", modal.data.TipoCuenta);
    formData.append("file", file);
    authFetch("/comitente/transferencias/upload", { method: "POST", body: formData })
      .then((data) => authFetch(`/extras/transferencias-rest/${year}`))
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
        addToast("Error al subir archivo!", { appearance: "error" });
      });
    setModal({ show: false, data: {} });
  };

  const dataTable = [];

  data.forEach((row, i) => {
    dataTable.push({
      cells: [
        { className: "text-center", style: { fontWeight: 700 }, content: "#" + (i + 1) },
        { className: "text-center", content: row.Comitente },
        { className: "text-center", content: new Date(row.FECHA).format() },
        { className: "text-center", content: row.TipoTransferencia },
        { className: "text-center", content: row.Ambito },
        { className: "text-center", content: row.TipoCuenta },
        { className: "text-right", style: { paddingRight: 50 }, content: (row.MontoTotal || 0).format() },
        {
          className: "text-left",
          content: <Acciones row={row} setModal={setModal} user={user} />,
        },
      ],
    });
  });

  return (
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
      {dataTable?.length > 0 ? (
        <Card style={{ marginTop: 15 }}>
          <Table
            className="posicions"
            columns={[
              { className: "text-center", content: "#" },
              { className: "text-center", content: "Comitente" },
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
        <h4 style={{ color: "#808080", textAlign: "center", marginTop: 40 }}>
          No tiene Transferencias en {year}
        </h4>
      )}
      <Modal modal={modal} setModal={setModal} title={"Subir Archivo"} handleSubmit={handleUpload} />
    </>
  );
};

const Acciones = ({ row, setModal, user }) => {
  console.log(row);
  return (
    <>
      {row.LINK ? (
        <>
          <Button
            icon
            size="xs"
            color="green"
            onClick={() => window.open("https://exe.aldazabal.com.ar/clientes/" + row.LINK, "_blank")}
          >
            <FiFileText />
          </Button>
        </>
      ) : (
        <Button icon size="xs" onClick={() => setModal({ show: true, data: row })}>
          <FiUpload style={{ strokeWidth: 3 }} />
        </Button>
      )}
    </>
  );
};

export default Transferencias;
