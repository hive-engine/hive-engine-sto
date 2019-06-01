import { autoinject, newInstance } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { environment } from 'environment';

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

    async getAllInfo(): Promise<ScotConfig[]> {
        const res = await this.http.fetch(`info`, {
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

    async getInfo(token: string): Promise<ScotInfo> {
        const res = await this.http.fetch(`info?token=${token}`, {
            method: 'GET'
        });

        return await res.json();
    }
}
