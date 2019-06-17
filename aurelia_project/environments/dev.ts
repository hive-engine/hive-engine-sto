import { NativeTokens } from 'common/types';
import { baseEnvironmentConfiguration } from 'base-environment';

export const environment: Partial<EnvironmentInterface> = {
    ...baseEnvironmentConfiguration,
    debug: false,
    testing: false,
	MAINTENANCE_MODE: false,
	CHAIN_ID: 'ssc-00000000000000000002',
	RPC_URL: 'https://testapi.steem-engine.com/',
    SCOT_API_URL: 'https://scot-api.steem-engine.com/',
    PRICE_API: 'https://postpromoter.net/api/prices',
    ACCOUNTS_API_URL: 'https://testaccounts.steem-engine.com',
    CONVERTER_API: 'https://converter-api.steem-engine.com/api',
    NODE_API_URL: 'http://localhost:3000/v1/',
	NATIVE_TOKEN: NativeTokens.Ssc,
    STEEMP_ACCOUNT: 'steemsc',
    AIRDROP: {
        FEE_ACCOUNT: 'beggars',
        FEE: '0.001',
        MEMO: 'airdrop-fee',
        TOKEN: NativeTokens.Ssc
    },
    SCOTBOT: {
        FEE_ACCOUNT: 'steemsc',
        CHANGE_ACCOUNT: 'null',
        FEES: {
            INITIAL: '0.001',
            SETUP_1: '0.002',
            SETUP_2: '0.003',
            CHANGE: '0.001'
        },
        PUBLIC_KEY: 'STM8YqKpQijsqjkkS2widNTsmNM3SrQe3xipEm2sfC4xMryvwhdBE',
        FEE_ACCOUNT_1: 'holger80',
        FEE_ACCOUNT_2: 'beggars'
    },
    NITROUS: {
        FEE_ACCOUNT: 'beggars',
        FEE: 200,
        FEE_SYMBOL: NativeTokens.Ssc
    }
};
