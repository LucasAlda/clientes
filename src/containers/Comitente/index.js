import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { FiMail, FiPhone, FiRefreshCcw } from "react-icons/fi";
import Info from "./Info";
import Card from "../../components/Card";
import Tabs from "../../components/Tabs";
import "../../assets/styles/Comitente.css";
import Posicion from "./Posicion";
import authFetch from "../../helpers/authFetch";
import { useToasts } from "react-toast-notifications";
import Button from "../../components/Button";
import Tickets from "./Tickets/";
import Operaciones from "./Operaciones";
import Caucionable from "./Caucionable";
import RecibosComprobantes from "./RecibosComprobantes";
import Transferencias from "./Transferencias";
import Documentos from "./Documentos";
import { SelectInput } from "../../components/Input";

const Comitente = ({ history, match, location, search, user }) => {
  const { addToast } = useToasts();
  const comitenteId = parseInt(match.params.comitente) || 0;
  const activeTab = location.pathname.split("/")[3] || "informacion";

  const [comitente, setComitente] = useState({});
  const [year, setYear] = useState("2021");
  const [posicion, setPosicion] = useState({ fecha: undefined, data: [] });

  useEffect(() => {
    authFetch(`/comitente/${comitenteId}`)
      .then((data) => setComitente(data))
      .catch((err) => addToast("Error cargando Comitente!", { appearance: "error" }));

    authFetch(`/comitente/posicion/${comitenteId}`)
      .then((data) => setPosicion({ fecha: new Date(), data }))
      .catch((err) => addToast("Error cargando posición!", { appearance: "error" }));
    //eslint-disable-next-line
  }, [comitenteId]);

  return (
    <>
      <div className="header-extended comitente" style={{ paddingBottom: 53 }}>
        <div className="container header" style={{ paddingBottom: 0 }}>
          <h2>
            <span>{comitenteId}</span>
            {comitente.NOMBRE_CUENTA}
          </h2>
          <div className="contact">
            {comitente.MAIL && (
              <div
                style={{ cursor: "pointer" }}
                onDoubleClick={() => window.open("mailto:" + comitente.MAIL, "emailWindow")}
              >
                <FiMail />
                {comitente.MAIL}
              </div>
            )}
            {comitente.TELEFONO && (
              <div>
                <FiPhone />
                {comitente.TELEFONO}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container">
        <Card
          style={{
            padding: "10px 10px",
            marginTop: -30,
            overflow: "visible",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
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
          {activeTab === "posicion" && (
            <span style={{ fontSize: 13 }}>
              {posicion.fecha ? posicion.fecha.formatFull() : "-"}
              <Button
                style={{ marginLeft: 5 }}
                color="transparent"
                onClick={() =>
                  authFetch(`/comitente/posicion/${comitenteId}`)
                    .then((data) => {
                      setPosicion({ fecha: new Date(), data });
                      addToast("Posición actualizada!", { appearance: "success" });
                    })
                    .catch((err) => addToast("Error cargando posición!", { appearance: "error" }))
                }
              >
                <FiRefreshCcw style={{ strokeWidth: 3 }} />
              </Button>
            </span>
          )}
          {"transferencias|recibos-comprobantes".includes(activeTab) && (
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
          )}
        </Card>
        <Switch>
          <Route
            exact
            path={match.path}
            render={(props) => <Info comitenteId={comitenteId} user={user} {...props} />}
          />
          <Route
            exact
            path={`${match.path}/informacion`}
            render={(props) => <Info comitenteId={comitenteId} user={user} {...props} />}
          />
          <Route
            exact
            path={`${match.path}/posicion`}
            render={(props) => (
              <Posicion
                comitenteId={comitenteId}
                posicion={posicion.data}
                user={user}
                setPosicion={setPosicion}
                {...props}
              />
            )}
          />
          <Route
            exact
            path={`${match.path}/operaciones-del-dia`}
            render={(props) => <Operaciones comitenteId={comitenteId} {...props} />}
          />
          <Route
            exact
            path={`${match.path}/caucionable`}
            render={(props) => <Caucionable comitenteId={comitenteId} {...props} />}
          />
          <Route
            exact
            path={`${match.path}/recibos-comprobantes`}
            render={(props) => (
              <RecibosComprobantes comitenteId={comitenteId} comitente={comitente} year={year} user={user} {...props} />
            )}
          />
          <Route
            exact
            path={`${match.path}/transferencias`}
            render={(props) => (
              <Transferencias comitenteId={comitenteId} comitente={comitente} year={year} user={user} {...props} />
            )}
          />
          <Route
            exact
            path={`${match.path}/documentos`}
            render={(props) => <Documentos comitenteId={comitenteId} user={user} {...props} />}
          />
          <Route
            exact
            path={`${match.path}/tickets/:ticketId?`}
            render={(props) => <Tickets comitenteId={comitenteId} user={user} {...props} />}
          />
        </Switch>
      </div>
    </>
  );
};

export default Comitente;
