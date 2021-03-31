import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import Card from "../../components/Card";
import { Table } from "../../components/Table";
import authFetch from "../../helpers/authFetch";

const ModalEspecies = ({ modal, setModal }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (modal.show) {
      authFetch("/search/especies", {
        method: "POST",
        body: {
          especie: modal.data.especie,
        },
      }).then((data) => setData(data));
    }
    setData([]);
  }, [modal.data.especie, modal.show]);

  return (
    <Modal title={`Posiciones en ${modal.data.especie}`} show={modal.show} setModal={setModal} size="lg" disabled>
      <Card>
        <Table
          className="position"
          columns={[
            { content: "Comitente" },
            { content: "Descripción" },
            { className: "text-center", content: "Especie" },
            { className: "text-right", content: "Cantidad" },
            { className: "text-right", content: "Monto" },
          ]}
          data={data.map((row) => ({
            cells: [
              { content: row.COMITENTE },
              { content: row.DESCRIPCION },
              { className: "text-center", content: row.ESPECIE },
              {
                className: "text-right",
                content: (row.CANTIDAD || 0).format({ decimal: 0 }),
                order: row.CANTIDAD || 0,
              },
              { className: "text-right", content: (row.MONTO_PESOS || 0).format(), order: row.MONTO_PESOS || 0 },
            ],
          }))}
          colTotals={[3, 4]}
          tableTotal
        />
      </Card>
    </Modal>
  );
};

export default ModalEspecies;
