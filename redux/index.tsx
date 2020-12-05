import { combineReducers, createStore } from 'redux';
import Auth from './Auth';

const reducers = combineReducers({
  Auth,
});

const store = createStore(reducers);
export default store;