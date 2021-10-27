import { BehaviorSubject } from 'rxjs';
import { callLogout } from '../utils/apiCalls';
import { clearAuthStore, sessionToken } from '../utils/funcs';

const userSubject = new BehaviorSubject(process.browser && JSON.parse(sessionStorage.getItem('user')));

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
    userObservable: userSubject.asObservable(),
    get user () { return userSubject.value },
    get userExists () { return JSON.parse(sessionStorage.getItem('user')) },
    logout,
};