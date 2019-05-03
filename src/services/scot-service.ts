import { autoinject, newInstance } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import environment from 'environment';

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

@autoinject()
export class ScotService {
    constructor(@newInstance() private http: HttpClient) {
        this.http.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl(environment.SCOT_API_URL)
        });
    }

    async getAllConfigs(): Promise<ScotConfig[]> {
        const res = await this.http.fetch(`config`, {
            method: 'GET'
        });

        return await res.json();
    }

    async getConfig(token): Promise<ScotConfig> {
        const res = await this.http.fetch(`config?token=${token}`, {
            method: 'GET'
        });

        return await res.json();
    }

    async update(token, body: ScotConfig) {
        const res = await this.http.fetch(`config?token=${token}`, {
            method: 'POST',
            body: json({
                ...body
            })
        });

        return await res.json();
    }
}
