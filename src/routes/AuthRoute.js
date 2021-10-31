import React, { Component, Suspense } from 'react';
import { Route } from "react-router-dom";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { get } from "lodash";
import PropTypes from "prop-types";

import { userService } from '../services/user';

import { notify, unnotify } from '../redux/modules/notifier/action';

import '../styles/main.css';

import Sidebar from '../components/layout/Sidebar';
import Nav from '../components/layout/Nav';
import Notifier from '../components/hoc/Notifier';
import ComponentLoader from '../components/hoc/ComponentLoader';

/**
 * Auth Route to protect components that require authentication before access
 */
class AuthRoute extends Component {

    constructor(props) {
        super(props);
        this.handleAuthVerification();
    }

    handleAuthVerification() {
        if (!userService.userExists) {
            return this.props?.history?.push('/');
        }
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.onRouteChange(prevProps.location.pathname);
        }
    }

    onRouteChange(prevPath) {
        // console.log(prevPath);
    }

    // fuction to disparse logout
    handleLogout = async () => {
        await userService.logout();
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

    // rendering
    render() {
        const { component: Component, ...rest } = this.props;
        return(
            <>
            <div className="content">
                {userService.userExists && <Nav user={userService.userExists} logout={this.handleLogout}/>}
                <Sidebar path={this.props.location.pathname}/>
                <Suspense fallback={<ComponentLoader />}>
                    <Route {...rest} render={
                        props => (
                            Object.assign(
                                props ? props : {}, 
                                { dispatchNotifier: this.handleNotifier.bind(this) }
                            ),
                            (
                                userService.userExists ? <Component {...props}/> : <Redirect to={{ pathname: "/", state: { from: props.location.pathname} }}/>
                            )
                        )
                    }/>
                </Suspense>
                {this.props.notifier && <Notifier />}
            </div>
            </>
        );
    }

    // define prop type
    static propTypes = {
        component: PropTypes.any.isRequired,
        notifier: PropTypes.bool.isRequired
    }
}

const mapStoreProps = store => {
    return {
        notifier: get(store, 'notifierReducer.notifier')
    }
};

const actionDispatcher = dispatch => ({
    dispatch
});

export default connect(mapStoreProps, actionDispatcher)(AuthRoute);