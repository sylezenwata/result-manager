import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

// views component
import Login from "../components/pages/Login";

import AuthRoute from "./AuthRoute";

import Dashboard from "../components/pages/Dashboard";
import Upload from '../components/pages/Upload';

export default class Routes extends Component {
    render() {
        return(
            <BrowserRouter>
                <Switch>
                    <Route 
                        exact
                        path="/"
                        component={Login}
                    />
                    <AuthRoute
                        exact
                        path="/dashboard"
                        component={Dashboard}
                    />
                    <AuthRoute
                        exact
                        path="/upload"
                        component={Upload}
                    />
                    {/* <Route component={} /> */}
                </Switch>
            </BrowserRouter>
        );
    }
}