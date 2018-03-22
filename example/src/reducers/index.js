import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import { withReduxStateSync } from '../lib/syncStorage'
 
const appReducer = combineReducers({
  todos,
  visibilityFilter
})

export default withReduxStateSync(appReducer)
