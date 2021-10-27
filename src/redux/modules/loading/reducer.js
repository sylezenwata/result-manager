import { actionTypes } from "./action";

const initState = {
    barLoading: false
}

const loadingReducer = (state = { ...initState }, { type }) => {
    switch (type) {
        case actionTypes.LOADING_START:
            return { ...state, barLoading: true };
        case actionTypes.LOADING_END:
            return { ...state, barLoading: false };
        default:
            return state;
    }
}

export default loadingReducer;