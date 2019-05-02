import { autoinject, newInstance } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import environment from 'environment';

@autoinject()
export class ScotService {
    constructor(@newInstance() private http: HttpClient) {
        this.http.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl(environment.SCOT_API_URL)
        });
    }

    async update(token, body: any) {
        const res = await this.http.fetch(`tokens?token=${token}`, {
            method: 'POST',
            body: json({
                ...body
            })
        });

        return await res.json();
    }
}
