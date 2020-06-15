import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import NavBar from "./components/NavBar/NavBar";
import Usuario from "./pages/Usuario/index";
import Produto from "./pages/Produto/index";
import Fornecedor from "./pages/Fornecedor/index";
import Login from "./pages/Login/index";

const history = createBrowserHistory();

const routes = (
  <Router history={history}>
    <NavBar />
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/usuario" component={Usuario} />
      <Route path="/produto" component={Produto} />
      <Route path="/fornecedor" component={Fornecedor} />
    </Switch>
  </Router>
);

export default routes;
