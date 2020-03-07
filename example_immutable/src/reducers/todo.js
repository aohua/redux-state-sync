const todo = (state = '', action) => {
    switch (action.type) {
        case 'TODO_ON_CHANGE':
            return action.todo;
        default:
            return state;
    }
};

export default todo;
