import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Principal from "../containers/Principal";
import Comitente from "../containers/Comitente";
import Extras from "../containers/Extras";
import Proveedor from "../containers/Proveedor";
import Login from "../containers/Login";
import Navbar from "../components/Navbar";
import axiosConfig from "../helpers/axios";
import numbersConfig from "../helpers/numbers";
import datesConfig from "../helpers/dates";
import authFetch from "../helpers/authFetch";
import ModalEspecies from "../containers/Principal/ModalEspecies";

axiosConfig();
numbersConfig();
datesConfig();

const App = () => {
  const { addToast } = useToasts();
  const [search, setSearch] = useState({ type: "activos", text: "" });
  const [auth, setAuth] = useState(window.localStorage.getItem("token"));
  const [user, setUser] = useState({});
  const [modalEspecies, setModalEspecies] = useState({ show: false, action: "SHOW", data: {} });

  useEffect(() => {
    if (auth) {
      authFetch("/user/whoami")
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          addToast("Error cargando el usuario!", { appearance: "error" });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  return (
    <BrowserRouter>
      {auth && window.location.pathname.split("/")[1] !== "login" && (
        <Navbar search={search} setSearch={setSearch} user={user} setModalEspecies={setModalEspecies} />
      )}
      <Switch>
        <Route exact path="/login" render={(props) => <Login {...props} setUser={setUser} setAuth={setAuth} />} />
        {!auth && <Redirect to="/login" />}
        <Route path="/comitente/:comitente" render={(props) => <Comitente user={user} {...props} />} />
        <Route path="/proveedor/:comitente" render={(props) => <Proveedor user={user} {...props} />} />
        <Route
          path="/extras"
          render={(props) => <Extras {...props} user={user} search={search} setSearch={setSearch} />}
        />
        <Route path="/agenda" render={(props) => <div>Agenda</div>} />
        <Route
          path="/"
          render={(props) => <Principal {...props} user={user} search={search} setSearch={setSearch} />}
        />
      </Switch>
      <ModalEspecies modal={modalEspecies} setModal={setModalEspecies} />
    </BrowserRouter>
  );
};

export default App;
