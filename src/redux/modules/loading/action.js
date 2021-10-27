// loading actions
export const actionTypes = {
    LOADING_START: 'LOADING_START',
    LOADING_END: 'LOADING_END'
};

// loading actions
export const loadingStart = () => ({ type: actionTypes.LOADING_START });
export const loadingEnd = () => ({ type: actionTypes.LOADING_END });