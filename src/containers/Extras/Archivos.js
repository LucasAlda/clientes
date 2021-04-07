import React from "react";
import { FiDownload } from "react-icons/fi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import authFetch from "../../helpers/authFetch";

const Archivos = ({ user }) => {
  return (
    <div style={{ margin: "auto", maxWidth: 1200 }}>
      <h3 style={{ marginTop: 20, marginBottom: 0 }}>Generar Archivos</h3>
      <Card style={{ marginTop: 10 }}>
        <div style={{ padding: "20px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h4 style={{ margin: 0, marginTop: 0 }}>Cauciones del dia</h4>
            <h5 style={{ color: "#b0b0b0", margin: 0, marginTop: 2, fontWeight: 600 }}>
              Devuelve excel con las cauciones necesarias para todos los comitentes
            </h5>
          </div>{" "}
          <div>
            <Button
              style={{ display: "flex", alignItems: "center", paddingRight: 20 }}
              onClick={() =>
                authFetch(`/files/excel/cauciones`, {
                  responseType: "blob",
                }).then((response) => {
                  const url = window.URL.createObjectURL(new Blob([response]));
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", `oms_caucion.xlsx`);
                  document.body.appendChild(link);
                  link.click();
                })
              }
            >
              <FiDownload style={{ marginRight: 5 }} />
              Generar
            </Button>
          </div>
        </div>
      </Card>
      <Card style={{ marginTop: 10 }}>
        <div style={{ padding: "7px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h4>Vamos de a poco...</h4>
          </div>
          <div>
            <Button style={{ display: "flex", alignItems: "center", paddingRight: 20 }}>
              <FiDownload style={{ marginRight: 5 }} />
              Generar
            </Button>
          </div>
        </div>
      </Card>
      <Card style={{ marginTop: 10 }}>
        <div style={{ padding: "7px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4>Vamos de a poco...</h4>
          <div>
            <Button style={{ display: "flex", alignItems: "center", paddingRight: 20 }}>
              <FiDownload style={{ marginRight: 5 }} />
              Generar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Archivos;
