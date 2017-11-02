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
      console.error("Your browser doesn't support localStorage");
    }
  }
  return next(action);
};

export function createStorageListener(store, config = {}) {
  let allowed = () => true;

  if (config.predicate && typeof config.predicate === 'function') {
    allowed = config.predicate;
  } else if (Array.isArray(config.ignore)) {
    allowed = type => config.ignore.indexOf(type) >= 0;
  }

  window.addEventListener('storage', (event) => {
    const { stampedAction } = JSON.parse(event.newValue);
    if (stampedAction && stampedAction.$time !== lastTimeStamp && !!allowed(stampedAction.type)) {
      lastTimeStamp = stampedAction.$time;
      store.dispatch(stampedAction);
    }
  });
}
