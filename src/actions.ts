export const GET_INIT_STATE = '&_GET_INIT_STATE';
export const SEND_INIT_STATE = '&_SEND_INIT_STATE';
export const RECEIVE_INIT_STATE = '&_RECEIVE_INIT_STATE';
export const INIT_MESSAGE_LISTENER = '&_INIT_MESSAGE_LISTENER';

export const getIniteState = () => ({ type: GET_INIT_STATE });
export const sendIniteState = () => ({ type: SEND_INIT_STATE });
export const receiveIniteState = (state: any) => ({ type: RECEIVE_INIT_STATE, payload: state });
export const initListener = () => ({ type: INIT_MESSAGE_LISTENER });
