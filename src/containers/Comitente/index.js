import React, { useState } from "react";
import { FiMail, FiPhone } from "react-icons/fi";
import "../../assets/styles/Comitente.css";
import Card from "../../components/Card";
import Tabs from "../../components/Tabs";

const Comitente = ({ match, search }) => {
  const comitente = parseInt(match.params.comitente) || 0;

  const [activeTab, setActiveTab] = useState("info");

  return (
    <>
      <div className="header-extended comitente" style={{ paddingBottom: 60 }}>
        <div className="container header">
          <h2>
            <span>13605</span>ALDAZABAL LUCAS RAFAEL Y/O ALDAZABAL LUCAS RAFAEL
          </h2>
          <div className="contact">
            <div>
              <FiMail />
              lucas@aldazabal.com.ar
            </div>
            <div>
              <FiPhone />
              4813-4784 113131-4796
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <Card style={{ padding: "15px 10px", marginTop: -34, overflow: "visible" }}>
          <Tabs
            tabStyle="pills"
            value={activeTab}
            handleSubmit={(value) => setActiveTab(value)}
            options={[
              { label: "Información", value: "info" },
              { label: "Posición", value: "posicion" },
              { label: "Operaciones del Día", value: "operaciones-del-dia" },
              { label: "Caucionable", value: "caucionable" },
              { label: "Rec y Comp", value: "rec-comp" },
              { label: "Transferencias", value: "transferencias" },
              { label: "Documentos", value: "documentos" },
              { label: "Tickets", value: "tickets" },
            ]}
          />
        </Card>
        <h4 style={{ marginBottom: 0, marginTop: 15 }}>Titulares y Autorizados</h4>
        <Card style={{ marginTop: 10, height: "calc((100vh - 300px) / 2 - 30px)" }}></Card>
        <h4 style={{ marginBottom: 0 }}>Cuentas Bancarias</h4>
        <Card style={{ marginTop: 10, height: "calc((100vh - 300px) / 2 - 30px)" }}></Card>
      </div>
    </>
  );
};

export default Comitente;
