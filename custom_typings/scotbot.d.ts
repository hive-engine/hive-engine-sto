interface ScotConfig {
    author_curve_exponent?: number;
    author_reward_percentage?: number;
    cashout_window_days?: number;
    curation_curve_exponent?: number;
    downvote_power_consumption?: number;
    downvote_regeneration_seconds?: number;
    issue_token?: boolean;
    json_metadata_app_value?: string;
    json_metadata_key?: string;
    json_metadata_value?: string;
    reduction_every_n_block?: number;
    reduction_percentage?: number;
    rewards_token?: number;
    rewards_token_every_n_block?: number;
    promoted_post_account?: string;
    vote_window_days?: number;

    /** The symbol of the token. eg. ENG */
    token?: string;

    /** Who is the token owner? */
    token_account?: string;

    vote_power_consumption?: number;
    vote_regeneration_seconds?: number;
}

interface ScotInfo {
    claimed_token?: number;

    /** A boolean that determines if the token is enabled or not */
    enabled?: boolean;

    last_reduction_block_num?: number;
    last_reward_block_num?: number;
    pending_rshares?: number;
    pending_token?: number;
    reward_pool?: number;
    rewards_token?: number;

    /** Starts with -1, after first 500 changes to 0, after first 250 changes to 1 and second 250 transfer is changed to 2 */
    setup_complete?: number;

    start_block_num?: number;

    /** The symbol of the token. eg. ENG */
    symbol?: string;

    total_generated_token?: number;
}
