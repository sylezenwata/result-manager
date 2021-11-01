import { actionTypes } from "./action";

const initState = {
    results: null,
    moreResults: false, 
    refreshResults: true
};

const resultsReducer = (state = { ...initState }, { type, payload }) => {
    switch (type) {
        case actionTypes.ADD:
            return { ...Object.assign(state, { results: payload.results, moreResults: (payload.moreResults || false), refreshResults: (payload.refreshResults || false) }) };
        case actionTypes.CLEAR:
            return { ...Object.assign(state, { results: null, moreResults: false, refreshResults: true }) };
        default:
            return state;
    }
}

export default resultsReducer;