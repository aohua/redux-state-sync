/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import Todo from './Todo';

const TodoList = ({ todos, toggleTodo }) => (
  <ul>
    {todos.map(todo => (
      <Todo
        key={todo.get('id')}
        completed={todo.get('completed')}
        text={todo.get('text')}
        onClick={() => toggleTodo(todo.get('id'))}
      />
        ))}
  </ul>
);

TodoList.propTypes = {
    todos: PropTypes.object.isRequired,
    toggleTodo: PropTypes.func.isRequired,
};

export default TodoList;
