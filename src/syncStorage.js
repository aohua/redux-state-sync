/* global window localStorage true */
let lastTimeStamp = 0;
const LAST_ACTION = 'LAST_ACTION';

export function timestampAction(action) {
  const stampedAction = action;
  stampedAction.$time = Date.now();
  return {
    stampedAction,
  };
}

export const actionStorageMiddleware = () => next => (action) => {
  if (action && !action.$time) {
    try {
      const stampedAction = timestampAction(action);
      lastTimeStamp = stampedAction.$time;
      localStorage.setItem(LAST_ACTION, JSON.stringify(stampedAction));
    } catch (e) {
      console.log("Your browser doesn't support localStorage");
    }
  }
  return next(action);
};

export function createStorageListener(store, config) {
  let ignore = [];
  if (config) {
    ignore =
      Object.prototype.toString.call(config.ignore) === '[object Array]' ? config.ignore : [];
  }
  window.addEventListener('storage', (event) => {
    if (event.key === LAST_ACTION) {
      const { stampedAction } = JSON.parse(event.newValue);
      if (
        stampedAction &&
        stampedAction.$time !== lastTimeStamp &&
        ignore.indexOf(stampedAction.type) === -1
      ) {
        lastTimeStamp = stampedAction.$time;
        store.dispatch(stampedAction);
      }
    }
  });
}
