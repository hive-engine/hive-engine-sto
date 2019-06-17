import { baseEnvironmentConfiguration } from 'base-environment';

export const environment: Partial<EnvironmentInterface> = {
    ...baseEnvironmentConfiguration,
    debug: false,
    testing: false,
	MAINTENANCE_MODE: false,
	CHAIN_ID: 'ssc-mainnet1',
    RPC_URL: 'https://api.steem-engine.com/rpc',
    NODE_API_URL: 'https://node-api.steem-engine.com/v1/',
    SCOT_API_URL: 'https://scot-api.steem-engine.com/',
    PRICE_API: 'https://postpromoter.net/api/prices',
	ACCOUNTS_API_URL: 'https://api.steem-engine.com/accounts',
    CONVERTER_API: 'https://converter-api.steem-engine.com/api',
	NATIVE_TOKEN: 'ENG',
    STEEMP_ACCOUNT: 'steem-peg',
    AIRDROP: {
        FEE_ACCOUNT: 'steem-eng',
        FEE: '20.000',
        MEMO: 'airdrop-fee',
        TOKEN: 'ENG'
    },
    SCOTBOT: {
        FEE_ACCOUNT: 'steemsc',
        CHANGE_ACCOUNT: 'null',
        FEES: {
            INITIAL: '500.000',
            SETUP_1: '250.000',
            SETUP_2: '250.000',
            CHANGE: '100.000'
        },
        PUBLIC_KEY: 'STM8YqKpQijsqjkkS2widNTsmNM3SrQe3xipEm2sfC4xMryvwhdBE',
        FEE_ACCOUNT_1: 'holger80',
        FEE_ACCOUNT_2: 'beggars'
    },
    NITROUS: {
        FEE_ACCOUNT: 'steem-eng',
        FEE: 200,
        FEE_SYMBOL: 'ENG'
    }
};
