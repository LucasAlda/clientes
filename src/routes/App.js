import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Template from "../containers/Template";
import axiosConfig from "../helpers/axios";
import numbersConfig from "../helpers/numbers";
import datesConfig from "../helpers/dates";

axiosConfig();
numbersConfig();
datesConfig();

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={(props) => <Template {...props} />} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
