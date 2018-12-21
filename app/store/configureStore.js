import { createStore, applyMiddleware, combineReducers, compose } from 'redux'; 
import thunkMiddleware from 'redux-thunk';

import authReducer from '../reducers/auth';

const configureStore = () => createStore(
    authReducer, 
    applyMiddleware(thunkMiddleware)
);

export default configureStore;