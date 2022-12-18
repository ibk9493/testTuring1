import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import axios from "axios";

import Login from "./Login";
import Dashboard from "./Dashboard";
import Home from "./Home";

import PrivateRoute from "./Utils/PrivateRoute";
import PublicRoute from "./Utils/PublicRoute";
import TTLogo from "./img/TTLogo.png";
import {
  getrefToken,
  getToken,
  getUser,
  removeUserSession,
  setUserSession,
} from "./Utils/Common";
import { Button } from "react-bootstrap";
function App() {
  const [authLoading, setAuthLoading] = useState(true);
  let toke = false;
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user) {
      setUser(getUser());
    }
    console.log(user);
  });
  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    const reftoken = getrefToken();

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const bodyParameters = {
      Authorization: `Bearer ${reftoken}`,
    };

    axios
      .post(
        `https://frontend-test-api.aircall.io/auth/refresh-token`,
        bodyParameters,
        config
      )
      .then((response) => {
        setUserSession(response.data.access_token, response.data.user);
        setAuthLoading(false);
        toke = true;
      })
      .catch((error) => {
        removeUserSession();
        setAuthLoading(false);
        toke = false;
      });
  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <div className="header">
            <div style={{ marginLeft: "10px" }}>
              <img src={TTLogo} width={300} height={35}></img>
            </div>
            <div>
              {getUser() && console.log("true")}
              {toke && <Button> Logout</Button>}
            </div>
            {/* <NavLink exact activeClassName="active" to="/">
              Home
            </NavLink> 
            <NavLink activeClassName="active" to="/login">
              Login
            </NavLink>
            <NavLink activeClassName="active" to="/dashboard">
              Dashboard
            </NavLink>
            <small>(Access with token only)</small>*/}
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <PublicRoute path="/login" component={Login} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
