import React, { Component, Suspense } from 'react';
import { Route } from "react-router-dom";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { get } from "lodash";
import PropTypes from "prop-types";

import { userService } from '../services/user';

import { notify, unnotify } from '../redux/modules/notifier/action';
import { addResults, clearResults } from '../redux/modules/results/action';

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

    // function to manage results
    handleResults = ({ type, results, moreResults, refreshResults }) => {
        switch (type) {
            case 'add':
                this.props.dispatch(addResults({ results, moreResults, refreshResults }));
                break;
            case 'clear':
                this.props.dispatch(clearResults());
                break;
            default:
                break;
        }
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
                                { 
                                    dispatchNotifier: this.handleNotifier.bind(this),
                                    dispatchResults: this.handleResults.bind(this),
                                    results: this.props.results,
                                    moreResults: this.props.moreResults,
                                    refreshResults: this.props.refreshResults
                                }
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
        notifier: PropTypes.bool.isRequired,
        refreshResults: PropTypes.bool.isRequired,
        moreResults: PropTypes.bool.isRequired,
        results: PropTypes.any,
    }
}

const mapStoreProps = store => {
    return {
        notifier: get(store, 'notifierReducer.notifier'),
        results: get(store, 'resultsReducer.results'),
        moreResults: get(store, 'resultsReducer.moreResults'),
        refreshResults: get(store, 'resultsReducer.refreshResults'),
    }
};

const actionDispatcher = dispatch => ({
    dispatch
});

export default connect(mapStoreProps, actionDispatcher)(AuthRoute);