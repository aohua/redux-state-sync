import { BroadcastChannel } from 'broadcast-channel';
import { AnyAction, Middleware, Dispatch, Reducer } from 'redux';
import { GET_INIT_STATE, SEND_INIT_STATE, RECEIVE_INIT_STATE, getIniteState, initListener } from './actions';
import MessageListener from './messageListener';
import { defaultConfig } from './constants';
import { guid, generateUuidForAction } from './utils';

import { Config } from './types';

let lastUuid = 0;

// generate current window unique id
const WINDOW_STATE_SYNC_ID = guid();

export function isActionAllowed({ predicate, blacklist, whitelist }: Config) {
    let allowed: typeof predicate = () => true;

    if (predicate && typeof predicate === 'function') {
        allowed = predicate;
    } else if (Array.isArray(blacklist)) {
        allowed = (action: AnyAction) => blacklist.indexOf(action.type) < 0;
    } else if (Array.isArray(whitelist)) {
        allowed = (action: AnyAction) => whitelist.indexOf(action.type) >= 0;
    }
    return allowed;
}

export function isActionSynced(action: AnyAction) {
    return !!action.$isSync;
}

export const createStateSyncMiddleware = (config: Config = defaultConfig) => {
    const allowed = isActionAllowed(config);
    const channel = new BroadcastChannel(config.channel, config.broadcastChannelOption);
    const prepareState = config.prepareState || defaultConfig.prepareState;
    let messageListener: MessageListener | null = null;

    const middleware: Middleware =
        ({ getState, dispatch }) =>
        (next) =>
        (action) => {
            // create message receiver
            if (!messageListener) {
                messageListener = new MessageListener({
                    channel,
                    dispatch,
                    allowed,
                    lastUuid,
                    windowId: WINDOW_STATE_SYNC_ID,
                });
            }
            // post messages
            if (action && !action.$uuid) {
                const stampedAction = generateUuidForAction(action, WINDOW_STATE_SYNC_ID);
                lastUuid = stampedAction.$uuid;
                try {
                    if (action.type === SEND_INIT_STATE) {
                        if (getState()) {
                            stampedAction.payload = prepareState(getState());
                            channel.postMessage(stampedAction);
                        }
                        return next(action);
                    }
                    if (allowed(stampedAction) || action.type === GET_INIT_STATE) {
                        channel.postMessage(stampedAction);
                    }
                } catch (e) {
                    console.error("Your browser doesn't support cross tab communication");
                }
            }
            return next(
                Object.assign(action, {
                    $isSync: typeof action.$isSync === 'undefined' ? false : action.$isSync,
                }),
            );
        };
    return middleware;
};

// eslint-disable-next-line max-len
export const createReduxStateSync =
    (appReducer: Reducer, prepareState = defaultConfig.prepareState) =>
    (state: any, action: AnyAction) => {
        let initState = state;
        if (action.type === RECEIVE_INIT_STATE) {
            initState = prepareState(action.payload);
        }
        return appReducer(initState, action);
    };

// init state with other tab's state
export const withReduxStateSync = createReduxStateSync;

export const initStateWithPrevTab = ({ dispatch }: { dispatch: Dispatch<AnyAction> }) => {
    dispatch(getIniteState());
};

/*
if don't dispath any action, the store.dispath will not be available for message listener.
therefor need to trigger an empty action to init the messageListener.

however, if already using initStateWithPrevTab, this function will be redundant
*/
export const initMessageListener = ({ dispatch }: { dispatch: Dispatch<AnyAction> }) => {
    dispatch(initListener());
};
