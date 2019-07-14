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

export async function loadBalances(state: State, username: string): Promise<State> {
    let newState = { ...state };

    try {
        const balances = await SE.loadBalances(username);

        newState.user.balances = balances;
    } catch (e) {
        return newState;
    }

    return newState;
}

export async function loadTokens(state: State): Promise<State> {
    let newState = { ...state };

    try {
        const tokens = await SE.loadTokens() as any[];

        newState.tokens = tokens;
    } catch (e) {
        return newState;
    }

    return newState;
}

export async function getToken(state: State, token: string) {
    let newState = { ...state };
    
    if (newState.user.balances) {
        const token = newState.user.balances.find(b => b.symbol === token);
        newState.token = token ? parseFloat(token.balance) : 0;
    } else {
        newState.token = 0;
    }

    return newState;
}

export async function loadUserBalances(state: State, symbol: string, account?): Promise<State> {
    let newState = { ...state };

    if (!account && newState.user.loggedIn) {
        account = newState.user.name;
    }
    
    if (!account) {
        return newState;
    }

    try {
        const userBalances = await SE.userBalances(symbol, account) as any[];

        newState.user.tokenBalance = userBalances;
    } catch (e) {
        return newState;
    }

    return newState;
}

store.registerAction('loading', loading);
store.registerAction('login', login);
store.registerAction('logout', logout);
store.registerAction('loadBalances', loadBalances);
store.registerAction('loadTokens', loadTokens);
store.registerAction('getToken', getToken);
store.registerAction('loadUserBalances', loadUserBalances);
