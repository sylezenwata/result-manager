import React from "react";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";

import configStore, { history } from "./redux/configStore";

import "./styles/animate.css";
import "./styles/base.css";

import Routes from "./routes";
import { xssWarning } from "./utils/funcs";

require('dotenv').config();

const store = configStore();

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Routes />
      </Router>
    </Provider>
  );
}

// console warning
xssWarning();

export default App;
