import type { AnyAction, Dispatch } from 'redux';
import { BroadcastChannel } from 'broadcast-channel';
export type Allowed = ((action: AnyAction) => boolean | null | undefined) | undefined;

export type Config = {
    channel?: string;
    predicate?: Allowed;
    blacklist?: string[];
    whitelist?: string[];
    broadcastChannelOption?: object | null;
    prepareState?: ((state: any) => any) | undefined;
};

export type MessageParams = {
    allowed: Allowed;
    dispatch: Dispatch<AnyAction>;
    windowId: string;
    channel: BroadcastChannel;
    lastUuid: string | number;
};
