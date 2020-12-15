import { combineReducers, createStore } from 'redux';
import Auth from './Auth';
import Socket from './Socket';
import Battle from './Battle';

const reducers = combineReducers({
  Auth,
  Socket,
  Battle
});

const store = createStore(reducers);
export default store;