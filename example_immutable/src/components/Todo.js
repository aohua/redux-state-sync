/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';

const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={{
            textDecoration: completed ? 'line-through' : 'none',
        }}
  >
    {text}
  </li>
);

Todo.propTypes = {
    onClick: PropTypes.func.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
};

export default Todo;
