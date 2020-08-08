import { createStore, compose, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import RootReducer from "./reducers/RootReducer";

const initialState = {};

export default createStore(
  RootReducer,
  initialState,
  compose(
    applyMiddleware(ReduxThunk)
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
