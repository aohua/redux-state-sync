import { List, Map } from 'immutable';

const todos = (state = List(), action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return state.push(
                Map({
                    id: action.id,
                    text: action.text,
                    completed: false,
                }),
            );
        case 'TOGGLE_TODO':
            return state.map(todo =>
                todo.get('id') === action.id ? todo.set('completed', !todo.get('completed')) : todo,
            );
        default:
            return state;
    }
};

export default todos;
