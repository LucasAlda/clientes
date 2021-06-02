import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { Table } from "../../components/Table";
import authFetch from "../../helpers/authFetch";
import Modal from "../Proveedor/ModalFacturas";
import { useToasts } from "react-toast-notifications";
import { SelectInput } from "../../components/Input";

const Facturas = ({ match, user }) => {
  const { addToast } = useToasts();
  const [data, setData] = useState([]);
  const [modal, setModal] = useState({ show: false, data: {} });
  const [year, setYear] = useState(2021);

  useEffect(() => {
    authFetch(`/extras/facturas-rest/${year}`)
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
      });
  }, [year]);

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
      .then((data) => authFetch(`/extras/facturas-rest/${year}`))
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
        addToast("Error al subir archivo!", { appearance: "error" });
      });
    setModal({ show: false, data: {} });
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
          content: <Acciones row={row} user={user} setModal={setModal} />,
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
      ) : (
        <h4 style={{ color: "#808080", textAlign: "center", marginTop: 40 }}>No tiene Facturas en {year}</h4>
      )}
      <Modal modal={modal} setModal={setModal} handleSubmit={handleUpload} title="SubirArchivo" />
    </>
  );
};

const Acciones = ({ row, user, handleDelete, setModal, handleMail }) => {
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

export default Facturas;
