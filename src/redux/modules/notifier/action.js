// loading actions
export const actionTypes = {
    NOTIFY: 'NOTIFY',
    UNNOTIFY: 'UNNOTIFY',
};

// loading actions
export const notify = (notificatioData) => ({ type: actionTypes.NOTIFY, payload: notificatioData });
export const unnotify = () => ({ type: actionTypes.UNNOTIFY });