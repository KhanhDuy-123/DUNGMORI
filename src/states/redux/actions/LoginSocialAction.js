import {LOGIN_SOCIAL} from './ActionTypes';

export function onLoginSocial(user) {
    return {
        type: LOGIN_SOCIAL,
        payload: user,
    }
}