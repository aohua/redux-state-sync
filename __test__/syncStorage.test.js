/* eslint-disable no-undef */
import { generateUuidForAction, isActionAllowed, createStateSyncMiddleware } from '../dist/syncState';

describe('action should have uuid', () => {
    it('action should have both $uuid and $wuid', () => {
        const action = { type: 'Test', payload: 'Test' };
        const stampedAction = generateUuidForAction(action);
        expect(stampedAction.$uuid).toBeDefined();
        expect(stampedAction.$wuid).toBeDefined();
    });
    it('action should have different $uuid and same $wuid', () => {
        const action1 = { type: 'Test', payload: 'Test' };
        const action2 = { type: 'Test', payload: 'Test' };
        const stampedAction1 = generateUuidForAction(action1);
        const stampedAction2 = generateUuidForAction(action2);
        expect(stampedAction1.$uuid === stampedAction2.$uuid).toBeFalsy();
        expect(stampedAction1.$wuid === stampedAction2.$wuid).toBeTruthy();
    });
});

describe('is action allowed', () => {
    it('action in blacklist should not be triggered', () => {
        const predicate = null;
        const blacklist = ['Test'];
        const whitelist = [];
        const allowed = isActionAllowed({ predicate, blacklist, whitelist });
        const action = { type: 'Test', payload: 'Test' };
        expect(allowed(action)).toBeFalsy();
    });
    it('action in blacklist and whitelist should not be triggered', () => {
        const predicate = null;
        const blacklist = ['Test'];
        const whitelist = ['Test'];
        const allowed = isActionAllowed({ predicate, blacklist, whitelist });
        const action = { type: 'Test', payload: 'Test' };
        expect(allowed(action)).toBeFalsy();
    });
    it('action in blacklist and predicate should be triggered', () => {
        const predicate = action => action.type === 'Test' || action.payload === 'Test';
        const blacklist = ['Test'];
        const whitelist = ['Test'];
        const allowed = isActionAllowed({ predicate, blacklist, whitelist });
        const action = { type: 'Test', payload: 'Test' };
        expect(allowed(action)).toBeTruthy();
        const action2 = { type: 'SecondTest', payload: 'Test' };
        expect(allowed(action2)).toBeTruthy();
    });
});

describe('state should be mapped', () => {
    it('state mapped to JSON', () => {
        const mockState = {
            test: 'Test',
        };
        const mockStore = {
            getState: () => mockState,
            dispatch: () => {},
        };

        const next = action => expect(action.payload).toEqual(JSON.stringify(mockState));

        createStateSyncMiddleware({ prepareState: JSON.stringify })(mockStore)(next)({ type: '&_SEND_INIT_STATE' });
    });
});
