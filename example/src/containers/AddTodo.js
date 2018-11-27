import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addTodo, todoOnChange } from '../actions'
 
class AddTodo extends Component {
  render() {
    const { todoOnChange, addTodo, todo } = this.props
    return (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault()
            if (!todo.trim()) {
              return
            }
            addTodo(todo)
            todoOnChange('')
          }}
        >
          <input onChange={(e) => {
            todoOnChange(e.target.value)
            }} value={todo}/>
          <button type="submit">
            Add Todo
          </button>
        </form>
      </div>
    )
  }
}
  

const mapStateToProps = state => ({
  todo: state.todo
})
 
const mapDispatchToProps = dispatch => ({
  addTodo: todo => dispatch(addTodo(todo)),
  todoOnChange: todo => dispatch(todoOnChange(todo))
})
 
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTodo)
