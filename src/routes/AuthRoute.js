import React, { Component } from 'react';
import { Route } from "react-router-dom";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { get } from "lodash";
import PropTypes from "prop-types";

import { userService } from '../services/user';

import { auth, logout } from "../redux/modules/auth/action";
import { loadingEnd, loadingStart } from "../redux/modules/loading/action";
import { notify, unnotify } from '../redux/modules/notifier/action';

import '../styles/main.css';

/**
 * Auth Route to protect components that require authentication before access
 */
class AuthRoute extends Component {

    constructor(props) {
        super(props);
        this.handleAuthVerification();
    }

    handleAuthVerification() {
        if (userService.userExists && !this.props.isLoggedIn) {
            this.props.dispatch(auth());
        }
        if (!userService.userExists) {
            this.props.dispatch(logout());
        }
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.onRouteChange();
        }
    }

    onRouteChange() {
        this.handleAuthVerification();
    }

    // fuction to disparse logout
    handleLogout = async () => {
        await userService.logout();
        window.location.href = '/';
    }

    // function to dispatch notifier
    handleNotifier = (data) => {
        if (!data) {
            return this.props.dispatch(unnotify());
        }
        const { message, type = 'default', timeOut = 10 } = data;
        if (this.props.notifier) {
            this.props.dispatch(unnotify());
        }
        this.props.dispatch(notify({ message, type, timeOut }));
    }

    handleBarLoading = (type) => {
        switch(type) {
            case 'start':
                return this.props.dispatch(loadingStart());
            case 'end':
                return this.props.dispatch(loadingEnd());
            default:
                return type;
        }
    };

    // rendering
    render() {
        const {component: Component, ...rest} = this.props;
        return(
            <Route {...rest} render={
                props => (
                    Object.assign(
                        props ? props : {}, 
                        { 
                            barLoading: this.props.barLoading, 
                            dispatchBarLoading: this.handleBarLoading.bind(this), 
                            dispatchLogout: this.handleLogout.bind(this), 
                            notifier: this.props.notifier, 
                            dispatchNotifier: this.handleNotifier.bind(this) 
                        }
                    ),
                    this.props.isLoggedIn 
                    || 
                    userService.userExists 
                        ? 
                        <Component {...props}/> 
                        : <Redirect to={{ pathname: "/", state: { from: props.location.pathname} }}/>
                )
            }/>
        );
    }

    // define prop type
    static propTypes = {
        component: PropTypes.any.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
        notifier: PropTypes.bool.isRequired
    }
}

const mapStoreProps = store => {
    return {
        isLoggedIn: get(store, 'authReducer.isLoggedIn'),
        barLoading: get(store, 'loadingReducer.barLoading'),
        notifier: get(store, 'notifierReducer.notifier')
    }
};

const actionDispatcher = dispatch => ({
    dispatch
});

export default connect(mapStoreProps, actionDispatcher)(AuthRoute);