import { combineReducers } from 'redux'
import todo from './todo'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import { withReduxStateSync } from '../lib/syncStorage'
 
const appReducer = combineReducers({
  todo,
  todos,
  visibilityFilter
})

export default withReduxStateSync(appReducer)
