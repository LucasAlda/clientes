import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Principal from "../containers/Principal";
import Comitente from "../containers/Comitente";
import Login from "../containers/Login";
import Navbar from "../components/Navbar";
import axiosConfig from "../helpers/axios";
import numbersConfig from "../helpers/numbers";
import datesConfig from "../helpers/dates";
import authFetch from "../helpers/authFetch";

axiosConfig();
numbersConfig();
datesConfig();

const App = () => {
  const { addToast } = useToasts();
  const [search, setSearch] = useState({ type: "activos", text: "" });
  const [auth, setAuth] = useState(window.localStorage.getItem("token"));
  const [user, setUser] = useState({});

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
        <Navbar search={search} setSearch={setSearch} user={user} />
      )}
      <Switch>
        <Route exact path="/login" render={(props) => <Login {...props} setUser={setUser} setAuth={setAuth} />} />
        {!auth && <Redirect to="/login" />}
        <Route exact path="/" render={(props) => <Principal {...props} search={search} setSearch={setSearch} />} />
        <Route path="/comitente/:comitente" render={(props) => <Comitente {...props} />} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
