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
