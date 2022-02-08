function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

export function guid() {
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export function generateUuidForAction(action, windowId) {
    const stampedAction = action;
    stampedAction.$uuid = guid();
    stampedAction.$wuid = windowId;
    return stampedAction;
}
