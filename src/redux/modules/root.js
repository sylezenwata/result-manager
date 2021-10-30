import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// reducers
import notifierReducer from "./notifier/reducer";

// genrate root reducer
export const createRootReducer = history => combineReducers({
    router: connectRouter(history),
    notifierReducer
});