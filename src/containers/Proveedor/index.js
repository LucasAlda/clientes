import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { FiMail, FiPhone } from "react-icons/fi";
import Info from "./Info";
import Card from "../../components/Card";
import Tabs from "../../components/Tabs";
import "../../assets/styles/Comitente.css";
import authFetch from "../../helpers/authFetch";
import { useToasts } from "react-toast-notifications";
import Facturas from "./Facturas";
import Tickets from "../Comitente/Tickets/";
import Documentos from "../Comitente/Documentos";
import { SelectInput } from "../../components/Input";

const Comitente = ({ history, match, location, search, user }) => {
  const { addToast } = useToasts();
  const comitenteId = parseInt(match.params.comitente) || 0;
  const activeTab = location.pathname.split("/")[3] || "informacion";

  const [comitente, setComitente] = useState({});
  const [year, setYear] = useState("2021");

  useEffect(() => {
    authFetch(`/proveedor/${comitenteId}`)
      .then((data) => setComitente(data))
      .catch((err) => addToast("Error cargando Comitente!", { appearance: "error" }));

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
              <div style={{ cursor: "pointer" }} onDoubleClick={() => window.open(comitente.MAIL, "emailWindow")}>
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
            handleSubmit={(value) => history.push({ pathname: `/proveedor/${comitenteId}/${value}/` })}
            options={[
              { label: "Información", value: "informacion" },
              { label: "Facturas", value: "facturas" },
              { label: "Documentos", value: "documentos" },
              { label: "Tickets", value: "tickets" },
            ]}
          />

          {"facturas".includes(activeTab) && (
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
            path={`${match.path}/facturas`}
            render={(props) => <Facturas comitenteId={comitenteId} user={user} year={year} {...props} />}
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
