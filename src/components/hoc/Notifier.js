import { get } from 'lodash';
import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { unnotify } from '../../redux/modules/notifier/action';

class Noitifier extends Component {

    state = {
        timeFunction: null
    }

    handleRemoveNotification = () => {
        if (this.props.timeOut) {
            clearTimeout(this.state.timeFunction);
        }
        this.removeNotification();
    }

    removeNotification = () => {
        this.props.dispatch(unnotify());
    }

    componentDidMount() {
        if (this.props.timeOut) {
            this.setState({ timeFunction: setTimeout(this.removeNotification, this.props.timeOut * 1000) })
        }
    }

    componentWillUnmount() {
        if (this.props.timeOut) {
            clearTimeout(this.state.timeFunction);
        }
    }

    render() {
        const { message, type, timeOut } = this.props;
        return(
            <>
            <div data-id="notifier" className="notification-wrap">
                <div className="notification">
                    <div className={`notification-content flex justify-b align-c ${type}`}>
                        <p className={`main-content${timeOut ? ' timed' : ''}`}>{message}</p>
                        {timeOut && <button onClick={this.handleRemoveNotification} className="close">&times;</button>}
                    </div>
                </div>
            </div>
            </>
        );
    }

    static propTypes = {
        notifier: PropTypes.bool.isRequired,
        message: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        timeOut: PropTypes.number
    }
}

const mapStoreProps = store => {
    return {
        notifier: get(store, 'notifierReducer.notifier'),
        message: get(store, 'notifierReducer.message'),
        type: get(store, 'notifierReducer.type'),
        timeOut: get(store, 'notifierReducer.timeOut'),
    }
};

const actionDispatcher = dispatch => ({
    dispatch
});

export default connect(mapStoreProps, actionDispatcher)(Noitifier);