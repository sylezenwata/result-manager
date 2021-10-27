// auth types
export const actionTypes = {
    AUTH: 'AUTH',
    LOGOUT: 'LOGOUT',
}

// auth actions
export const auth = () => ({ type: actionTypes.AUTH });
export const logout = () => ({type: actionTypes.LOGOUT});