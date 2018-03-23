/* global jest window localStorage describe it test expect */
import { actionStorageMiddleware, createStorageListener, generateUuidForAction } from '../dist/syncStorage';

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
  it('action should have $uuid added', () => {
    const action = { type: 'Test', payload: 'Test' };
    expect(generateUuidForAction(action).$uuid).toBeDefined();
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
    expect(triggeredAction.$uuid).toBe(undefined);
  });
});
