import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

// custom Route component for pages that require authentication
import AuthRoute from "./AuthRoute";

// page components
import Login from "../components/pages/Login";
import NotFound from "../components/pages/NotFound";

// lazy loaded page components
const Dashboard = React.lazy(() => import('../components/pages/Dashboard'));
const Upload = React.lazy(() => import('../components/pages/Upload'));

export default class Routes extends Component {
    render() {
        return(
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <AuthRoute path="/dashboard" component={Dashboard} />
                    <AuthRoute path="/upload" component={Upload} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        );
    }
}