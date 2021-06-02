import React from "react";
import { Route, Switch } from "react-router";
import "../../assets/styles/Extras.css";
import Card from "../../components/Card";
import Tabs from "../../components/Tabs";
import Archivos from "./Archivos";
import Facturas from "./Facturas";
import RecibosComprobantes from "./RecibosComprobantes";

const Extras = ({ history, location, match, user }) => {
  const activeTab = location.pathname.split("/")[2] || "archivos";
  return (
    <>
      <div className="header-extended comitente" style={{ height: 95 }}>
        <div className="container header" style={{ paddingBottom: 0 }}>
          <h3 style={{ margin: 0, paddingLeft: 10, fontWeight: 600 }}>Extras</h3>
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
            handleSubmit={(value) => history.push({ pathname: `/extras/${value}/` })}
            options={[
              { label: "Archivos", value: "archivos" },
              { label: "Rec. Comp.", value: "recibos-comprobantes" },
              { label: "Facturas", value: "facturas" },
              { label: "Formularios", value: "formularios" },
            ]}
          />
        </Card>
        <Switch>
          <Route exact path={`${match.path}/`} render={(props) => <Archivos user={user} />} />
          <Route exact path={`${match.path}/archivos`} render={(props) => <Archivos user={user} />} />
          <Route
            exact
            path={`${match.path}/recibos-comprobantes`}
            render={(props) => <RecibosComprobantes user={user} />}
          />
          <Route exact path={`${match.path}/facturas`} render={(props) => <Facturas user={user} />} />
          <Route exact path={`${match.path}/formularios`} render={(props) => <h4>Hola</h4>} />
        </Switch>
      </div>
    </>
  );
};

export default Extras;
