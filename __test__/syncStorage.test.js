/* global jest window localStorage describe it test expect */
import { actionStorageMiddleware, createStorageListener, timestampAction } from '../dist/syncStorage';

const LAST_ACTION = 'LAST_ACTION';
let triggeredAction = {};
let stampedAction = {};
const store = {
  dispatch(action) {
    triggeredAction = action;
  },
};

describe('dispatch a test action', () => {
  createStorageListener(store);
  it('action should have $time added', () => {
    const action = { type: 'Test', payload: 'Test' };
    expect(timestampAction(action).$time).toBeDefined();
  });

  it('action should be saved into localStorage', () => {
    const action = { type: 'Test', payload: 'Test' };
    const getState = () => {};
    actionStorageMiddleware({ getState })(next => next)(action);
    stampedAction = action;
    expect(localStorage.getItem(LAST_ACTION)).toBeDefined();
  });

  it('same action should not be triggered, because the timestamp is the same as the latest timestamp', () => {
    expect(triggeredAction.type).toBe(undefined);
    expect(triggeredAction.payload).toBe(undefined);
    expect(triggeredAction.$time).toBe(undefined);
  });
});
