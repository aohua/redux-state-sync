/* global jest window localStorage describe it test expect */
import { actionStorageMiddleware, createStorageListener, timestampAction } from '../syncStorage';

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
    expect(timestampAction(action).stampedAction.$time).toBeDefined();
  });

  it('action should be saved into localStorage', () => {
    const action = { type: 'Test', payload: 'Test' };
    actionStorageMiddleware()(next => next)(action);
    stampedAction = action;
    expect(localStorage.getItem(LAST_ACTION)).toBeDefined();
  });

  it('same action should be triggered', () => {
    expect(triggeredAction.type).toBe(stampedAction.type);
    expect(triggeredAction.payload).toBe(stampedAction.payload);
    expect(triggeredAction.$time).toBe(stampedAction.$time);
  });
});
