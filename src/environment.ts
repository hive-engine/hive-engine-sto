import { baseEnvironmentConfiguration } from 'base-environment';
import { NativeTokens } from 'common/types';

export const environment: Partial<EnvironmentInterface> = {
    ...baseEnvironmentConfiguration,
    debug: false,
    testing: false,
	MAINTENANCE_MODE: false,
	CHAIN_ID: 'ssc-mainnet1',
    RPC_URL: 'https://api.steem-engine.com/rpc',
    NODE_API_URL: 'https://us-central1-steem-engine-dex.cloudfunctions.net/api/',
    SCOT_API_URL: 'https://scot-api.steem-engine.com/',
    PRICE_API: 'https://postpromoter.net/api/prices',
	ACCOUNTS_API_URL: 'https://api.steem-engine.com/accounts',
    CONVERTER_API: 'https://converter-api.steem-engine.com/api',
	NATIVE_TOKEN: NativeTokens.Eng,
    STEEMP_ACCOUNT: 'steem-peg',
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
        FEE_ACCOUNT_1: 'eonwarped',
        FEE_ACCOUNT_2: 'beggars'
    },
    NITROUS: {
        FEE_ACCOUNT: 'steem-eng',
        FEE: '1000.000',
        FEE_SYMBOL: NativeTokens.Eng
    },
    SCOTBB: {
        FEE_ACCOUNT: 'steem-eng',
        FEE: '1000.000',
        FEE_SYMBOL: NativeTokens.Eng
    },
    SCOTTUBE: {
        FEE_ACCOUNT: 'steem-eng',
        FEE: '1000.000',
        FEE_SYMBOL: NativeTokens.Eng
    },
    SCOTPEAK: {
        FEE_ACCOUNT: 'steem-eng',
        FEE: '1000.000',
        FEE_SYMBOL: NativeTokens.Eng
    },
};
