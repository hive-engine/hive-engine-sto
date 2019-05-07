interface ScotConfig {
    author_curve_exponent?: number;
    author_reward_percentage?: number;
    cashout_window_days?: number;
    curation_curve_exponent?: number;
    downvote_power_consumption?: number;
    downvote_regeneration_seconds?: number;
    issue_token?: boolean;
    json_metadata_key?: string;
    json_metadata_value?: string;
    reduction_every_n_block?: number;
    reduction_percentage?: number;
    rewards_token?: number;
    rewards_token_every_n_block?: number;
    token?: string;
    token_account?: string;
    vote_power_consumption?: number;
    vote_regeneration_seconds?: number;
}

interface ScotInfo {
    claimed_token?: number;
    enabled?: boolean;
    last_reduction_block_num?: number;
    last_reward_block_num?: number;
    pending_rshares?: number;
    pending_token?: number;
    reward_pool?: number;
    rewards_token?: number;
    setup_complete?: number;
    start_block_num?: number;
    symbol?: string;
    total_generated_token?: number;
}
