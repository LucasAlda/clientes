import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { FiMail, FiPhone } from "react-icons/fi";
import Info from "./Info";
import Card from "../../components/Card";
import Tabs from "../../components/Tabs";
import "../../assets/styles/Comitente.css";
import Posicion from "./Posicion";
import authFetch from "../../helpers/authFetch";
import { useToasts } from "react-toast-notifications";

const comitentes = [
  {
    id: 10351,
    nombre: "ALDAZABAL Y CIA FRACCIONES DE TERCEROS",
    mail: "exequiel@aldazabal.sba.com.ar",
    tel: "4394-4428 /6818/ 4613",
  },
  {
    id: 10961,
    nombre: "ALDAZABAL Y COMPANIA S.A.",
    mail: "exequiel@aldazabal.sba.com.ar",
    tel: "4394-4613/6818",
  },
  {
    id: 11642,
    nombre: "ALDAZABAL IGNACIO RAFAEL (NAEX) Y/O IGLESIAS BLANCO IGNACIO Y/O ALDAZABAL EXE",
    mail: "ia@naex.com.ar;ni@naex.com.ar",
    tel: "4394-6818 155-626-0808",
  },
  {
    id: 12136,
    nombre: "ALDAZABAL Y COMPANIA S.A. CUENTA SUSCRIPCION , lLICITACION Y CANJE EN CURSO",
    mail: "exequiel@aldazabal.sba.com.ar",
    tel: "4394-6818 155-626-0808",
  },
  {
    id: 12207,
    nombre: "ALDAZABAL SEBASTIAN RAFAEL Y/O ALDAZABAL EXEQUIEL RAFAEL Y/O HERBIN LUCILA",
    mail: "sebastian@aldazabal.com.ar;saldazabal@hotmail.com",
    tel: "4394-6818 155-626-0811",
  },
];

const Comitente = ({ history, match, location, search }) => {
  const { addToast } = useToasts();
  const comitenteId = parseInt(match.params.comitente) || 0;
  const activeTab = location.pathname.split("/")[3] || "informacion";

  const [comitente, setComitente] = useState({});

  useEffect(() => {
    setTimeout(() => {
      authFetch(`/comitente/${comitenteId}`)
        .then((data) => setComitente(data))
        .catch((err) => addToast("Error cargando Comitente!", { appearance: "error" }));
    }, 100);
  }, [comitenteId]);

  return (
    <>
      <div className="header-extended comitente" style={{ paddingBottom: 53 }}>
        <div className="container header">
          <h2>
            <span>{comitente.id}</span>
            {comitente.nombre}
          </h2>
          <div className="contact">
            {comitente.mail ? (
              <div>
                <FiMail />
                {comitente.mail}
              </div>
            ) : (
              <div style={{ height: 20 }}></div>
            )}
            {comitente.tel && (
              <div>
                <FiPhone />
                {comitente.tel}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container">
        <Card style={{ padding: "10px 10px", marginTop: -30, overflow: "visible" }}>
          <Tabs
            tabStyle="pills"
            value={activeTab}
            handleSubmit={(value) => history.push({ pathname: `/comitente/${comitenteId}/${value}/` })}
            options={[
              { label: "Información", value: "informacion" },
              { label: "Posición", value: "posicion" },
              { label: "Operaciones del Día", value: "operaciones-del-dia" },
              { label: "Caucionable", value: "caucionable" },
              { label: "Rec y Comp", value: "recibos-comprobantes" },
              { label: "Transferencias", value: "transferencias" },
              { label: "Documentos", value: "documentos" },
              { label: "Tickets", value: "tickets" },
            ]}
          />
        </Card>
        <Switch>
          <Route exact path={match.path} render={(props) => <Info comitenteId={comitenteId} {...props} />} />
          <Route
            exact
            path={`${match.path}/informacion`}
            render={(props) => <Info comitenteId={comitenteId} {...props} />}
          />
          <Route
            exact
            path={`${match.path}/posicion`}
            render={(props) => <Posicion comitenteId={comitenteId} {...props} />}
          />
        </Switch>
      </div>
    </>
  );
};

export default Comitente;
