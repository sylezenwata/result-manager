import { createStore, applyMiddleware } from "redux";
import { createRootReducer } from "./modules/root";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

// generate browser history
export const history = createBrowserHistory();

// generate redux store
export default function configStore() {
    const store = createStore(
        createRootReducer(history),
        applyMiddleware(
            routerMiddleware(history)
        )
    );
    return store;
}
