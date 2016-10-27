/* global jest window localStorage describe it test expect */
import { actionStorageMiddleware, createStorageListener, timestampAction } from '../syncStorage';

const LAST_ACTION = 'LAST_ACTION';
describe('dispatch a test action', () => {
  it('action should have $time added', () => {
    const action = { type: 'Test', payload: 'Test' };
    expect(timestampAction(action).stampedAction.$time).toBeDefined();
  });

  it('action should be saved into localStorage', () => {
    const stampedAction = { type: 'Test', payload: 'Test' };
    actionStorageMiddleware()(action => action)(stampedAction);
    expect(localStorage.getItem(LAST_ACTION)).toBeDefined();
  });
});
