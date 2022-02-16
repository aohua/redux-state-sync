import { Config } from './types';
export const defaultConfig: Config = {
    channel: 'redux_state_sync',
    predicate: null,
    blacklist: [],
    whitelist: [],
    broadcastChannelOption: undefined,
    prepareState: (state) => state,
};
