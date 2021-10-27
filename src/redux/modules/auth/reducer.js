import { actionTypes } from "./action";

// init state
const initState = {
    isLoggedIn: false
};

// auth reducers
const authReducer = (state = { ...initState }, { type }) => {
    switch (type) {
        case actionTypes.AUTH:
            return { ...state, isLoggedIn: true }
        case actionTypes.LOGOUT:
            return { ...state, isLoggedIn: false }
        default:
            return state;
    }
}

export default authReducer;