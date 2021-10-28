import { get } from "lodash";
import React, { Component, createRef } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

import config from '../../utils/config';

import InnerNotification from '../hoc/InnerNotification';
import PageLoader from '../hoc/PageLoader';

import { userService } from '../../services/user';
import { auth } from "../../redux/modules/auth/action";

import '../../styles/form.css';
import '../../styles/m/login.css';

import { callLogin } from "../../utils/apiCalls";
import { sessionToken, sessionUser } from "../../utils/funcs";
import InternalLoader from "../hoc/InternalLoader";

class Login extends Component {

    // static state
    state = {
        showNotification: false,
        notiMessage: null,
        notiType: 'error',
        submitting: false,
        pageLoading: true
    }

    componentDidMount() {
        if (userService.userExists) {
            !this.props.isLoggedIn && this.props.dispatch(auth());
            return this.props.history.push('/dashboard');
        }
        this.setState({pageLoading: false});
    }

    // refs
    emailRef = createRef();
    passwordRef = createRef();

    // form submit handler
    handleSubmit = async (e) => {
        e.preventDefault();
        // remove existing error
        this.setState({showNotification: false, submitting: true});
        // handle form
        const email = this.emailRef.current.value;
        const password = this.passwordRef.current.value;
        const res = await callLogin({ email, password });
        if (res.error) {
            return this.setState({ showNotification: true, submitting: false, notiMessage: res.message });
        }
        // store user data and token in sessionStorage
        let { user, tokens } = res;
        sessionUser(user);
        sessionToken(tokens);
        // return to previous page or default page
        window.location.href = (this.props.location?.state?.from || '/dashboard');
    };

    handleForgotPassword = () => {
        alert('Contact ICT support to recover password.');
    };
    
    render() {
        return (
            this.state.pageLoading ? (
                <PageLoader />
            ) : (
                <>
                <Helmet>
                    <title>Login - {config.APP_NAME}</title>
                    <meta name="description" content="Login as admin to manage results" />
                </Helmet>
                <div className="content flex">
                    <div className="main-panel p-tb-20 flex flex-col justify-c">
                        <form onSubmit={this.handleSubmit} method="post" className="m-b-20">
                            <div className={`form b-s-low`}>
                                <div className={`form-header flex flex-col align-c`}>
                                    <img src="/assets/media/images/logo.png" style={{width:"80px",height:"80px"}} className="me-3" alt={config.ORG_SHORT + ' Logo'} />
                                    <h2 className="text-c m-t-10">Admin</h2>
                                </div>
                                <div className={`form-body`}>
                                    {
                                        this.state.showNotification && <InnerNotification message={this.state.notiMessage} type={this.state.notiType} />
                                    }
                                    <div className={`input-wrap`}>
                                        <div className="form-input__wrap">
                                        <label className={`form-input__label`}>
                                            <span>Email</span>
                                            <input disabled={this.state.submitting} ref={this.emailRef} type="email" className={`form-input`} name="email" placeholder="Enter email" required />
                                        </label>
                                        </div>
                                    </div>
                                    <div className={`input-wrap`}>
                                        <div className="form-input__wrap">
                                            <label className={`form-input__label`}>
                                                <span>Password</span>
                                                <input disabled={this.state.submitting} ref={this.passwordRef} type="password" className={`form-input`} name="password" placeholder="Enter password" required />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex justify-e m-t-10 position-r">
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a href="#" onClick={this.handleForgotPassword}>Forgot Password?</a>
                                    </div>
                                    <div className={`btn-wrap`}>
                                        <button disabled={this.state.submitting} type="submit" className="btn primary w-100">
                                        {
                                            this.state.submitting 
                                            ? 
                                            <InternalLoader message='Verifying...' />
                                            : 
                                            'Log In'
                                        }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                </>
            )
        );
    }
}

// required props from store
const mapStoreProps = store => {
    return {
        isLoggedIn: get(store, 'authReducer.isLoggedIn')
    }
};

// action dispatcher
const actionDispathcer = dispatch => ({
    dispatch
});

export default connect(mapStoreProps, actionDispathcer)(Login);