import { SteemEngine } from 'services/steem-engine';
import { Container } from 'aurelia-framework';
import { State } from './state';
import store from './store';

const SE: SteemEngine = Container.instance.get(SteemEngine);

export function loading(state: State, boolean: boolean) {
    const newState = { ...state };

    newState.loading = Boolean(boolean);

    return newState;
}

export async function login(state: State, user: { username: string, accessToken: string, refreshToken: string }): Promise<State> {
    let newState = { ...state };

    newState.user.name = user.username;
    newState.user.accessToken = user.accessToken;
    newState.user.refreshToken = user.refreshToken;
    newState.user.loggedIn = true;

    return newState;
}

export async function logout(state: State): Promise<State> {
    const newState = { ...state };

    newState.user = {
        name: '',
        accessToken: '',
        refreshToken: '',
        balances: [],
        buyBook: [],
        sellBook: [],
        tokenBalance: [],
        totalUsdValue: 0.00,
        loggedIn: false
    };

    return newState;
}

store.registerAction('loading', loading);
store.registerAction('login', login);
store.registerAction('logout', logout);
