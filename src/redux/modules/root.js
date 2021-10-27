import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// reducers
import authReducer from "./auth/reducer";
import loadingReducer from "./loading/reducer";
import notifierReducer from "./notifier/reducer";

// genrate root reducer
export const createRootReducer = history => combineReducers({
    router: connectRouter(history),
    authReducer,
    loadingReducer,
    notifierReducer
});