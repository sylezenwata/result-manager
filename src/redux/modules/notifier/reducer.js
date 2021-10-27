import { actionTypes } from "./action";

const initState = {
    notifier: false,
    message: null,
    type: 'default',
    timeOut: 10
};

const notifierReducer = (state = { ...initState }, { type, payload }) => {
    switch (type) {
        case actionTypes.NOTIFY:
            payload.notifier = true;
            return { ...Object.assign(state, payload) };
        case actionTypes.UNNOTIFY:
            return { ...state, notifier: false };
        default:
            return state;
    }
}

export default notifierReducer;