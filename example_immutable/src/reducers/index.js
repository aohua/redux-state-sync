import { combineReducers } from 'redux-immutable';
import Immutable from 'immutable';
import todo from './todo';
import todos from './todos';
import visibilityFilter from './visibilityFilter';
import { withReduxStateSync } from '../lib/syncState';

const appReducer = combineReducers({
    todo,
    todos,
    visibilityFilter,
});

export default withReduxStateSync(appReducer, state => Immutable.fromJS(state));
