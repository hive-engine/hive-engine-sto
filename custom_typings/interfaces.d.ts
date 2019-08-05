interface PeggedToken {
    name: string;
    symbol: string;
    pegged_token_symbol: string;
}

interface EnvironmentInterface {
    debug: boolean;
    testing: boolean;
    MAINTENANCE_MODE: boolean;
    CHAIN_ID: string;
    siteName: string;
    defaultLocale: string;
    RPC_URL: string;
    ACCOUNTS_API_URL: string;
    CONVERTER_API: string;
    NODE_API_URL: string;
    SCOT_API_URL: string;
    GRAPHQL_API: string;
    PRICE_API: string;
    SCOT_API: string;
    STEEMP_ACCOUNT: string;
    NATIVE_TOKEN: string;
    DISABLED_TOKENS: string[];
    PEGGED_TOKEN: string;
    PEGGED_TOKENS: PeggedToken[];
    AIRDROP: {
        FEE_ACCOUNT: string;
        MEMO: string;
        TOKEN: string;
    };
    SCOTBOT: {
        FEE_ACCOUNT: string;
        CHANGE_ACCOUNT: string;
        FEES: {
            INITIAL: string;
            SETUP_1: string;
            SETUP_2: string;
            CHANGE: string;
        }
        PUBLIC_KEY: string;
        FEE_ACCOUNT_1: string;
        FEE_ACCOUNT_2: string;
    };
    NITROUS: {
        FEE_ACCOUNT: string;
        FEE: string;
        FEE_SYMBOL: string;
    }
}
