// loading actions
export const actionTypes = {
    ADD: 'ADD',
    CLEAR: 'CLEAR',
};

// loading actions
export const addResults = ({ results, moreResults, refreshResults }) => ({ type: actionTypes.ADD, payload: { results, moreResults, refreshResults } });
export const clearResults = () => ({ type: actionTypes.CLEAR });