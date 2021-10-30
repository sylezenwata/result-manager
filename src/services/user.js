import { callLogout } from '../utils/apiCalls';
import { clearAuthStore, sessionToken } from '../utils/funcs';

/**
 * logout handler
 */
const logout = async () => {
    // logout from server
    callLogout(sessionToken(null, 'refresh'));
    // remove user and tokens
    clearAuthStore();
};

// expprt userService
export const userService = {
    get userExists () {
        return JSON.parse(sessionStorage.getItem('user')) 
    },
    logout,
};