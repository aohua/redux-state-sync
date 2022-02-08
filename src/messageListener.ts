import { AnyAction } from 'redux';
import { BroadcastChannel } from 'broadcast-channel';
import { GET_INIT_STATE, SEND_INIT_STATE, RECEIVE_INIT_STATE, sendIniteState, receiveIniteState } from './actions';
import { MessageParams } from './types';
class MessageListener {
    isSynced: boolean;
    tabs: { [tabId: string]: boolean };
    handleOnMessage: (stampedAction: AnyAction) => void;
    messageChannel: BroadcastChannel;
    constructor({ channel, dispatch, allowed, windowId, lastUuid }: MessageParams) {
        this.isSynced = false;
        this.tabs = {};
        this.handleOnMessage = (stampedAction: AnyAction) => {
            // Ignore if this action is triggered by this window
            if (stampedAction.$wuid === windowId) {
                return;
            }
            // IE bug https://stackoverflow.com/questions/18265556/why-does-internet-explorer-fire-the-window-storage-event-on-the-window-that-st
            if (stampedAction.type === RECEIVE_INIT_STATE) {
                return;
            }
            // ignore other values that saved to localstorage.
            if (stampedAction.$uuid && stampedAction.$uuid !== lastUuid) {
                if (stampedAction.type === GET_INIT_STATE && !this.tabs[stampedAction.$wuid]) {
                    this.tabs[stampedAction.$wuid] = true;
                    dispatch(sendIniteState());
                } else if (stampedAction.type === SEND_INIT_STATE && !this.tabs[stampedAction.$wuid]) {
                    if (!this.isSynced) {
                        this.isSynced = true;
                        dispatch(receiveIniteState(stampedAction.payload));
                    }
                } else if (allowed(stampedAction)) {
                    lastUuid = stampedAction.$uuid;
                    dispatch(
                        Object.assign(stampedAction, {
                            $isSync: true,
                        }),
                    );
                }
            }
        };
        this.messageChannel = channel;
        this.messageChannel.onmessage = this.handleOnMessage;
    }
}

export default MessageListener;
