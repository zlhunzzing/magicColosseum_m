import { combineReducers, createStore } from 'redux';
import Auth from './Auth';
import Socket from './Socket'

const reducers = combineReducers({
  Auth,
  Socket,
});

const store = createStore(reducers);
export default store;