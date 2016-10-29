import indexOf from 'lodash/indexOf';
import get from 'lodash/get';

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
  if (action) {
    if (!action.$time) {
      const stampedAction = timestampAction(action);
      lastTimeStamp = stampedAction.$time;
      localStorage.setItem(LAST_ACTION, JSON.stringify(stampedAction));
    }
  }
  return next(action);
};

export function createStorageListener(store, config) {
  let ignore = [];
  if (config) {
    ignore = get(config, 'ignore', []);
  }

  window.addEventListener('storage', (event) => {
    const { stampedAction } = JSON.parse(event.newValue);
    if (stampedAction
      && stampedAction.$time
      !== lastTimeStamp
      && indexOf(ignore, stampedAction.type) < 0) {
      lastTimeStamp = stampedAction.$time;
      store.dispatch(stampedAction);
    }
  });
}
