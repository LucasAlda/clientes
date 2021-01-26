import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Principal from "../containers/Principal";
import Comitente from "../containers/Comitente";
import Navbar from "../components/Navbar";
import axiosConfig from "../helpers/axios";
import numbersConfig from "../helpers/numbers";
import datesConfig from "../helpers/dates";

axiosConfig();
numbersConfig();
datesConfig();

const App = () => {
  const [search, setSearch] = useState({ type: "activos", text: "" });

  useEffect(() => {
    console.log(search);
  }, [search]);

  return (
    <BrowserRouter>
      <Navbar search={search} setSearch={setSearch} />
      <Switch>
        <Route exact path="/" render={(props) => <Principal {...props} search={search} setSearch={setSearch} />} />
        <Route exact path="/comitente/:comitente" render={(props) => <Comitente {...props} />} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
