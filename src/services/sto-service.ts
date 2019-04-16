import { autoinject, lazy } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import environment from 'environment';

@autoinject()
export class StoService {
    private http: HttpClient;

    constructor(@lazy(HttpClient) private getHttpClient: () => HttpClient) {
        this.http = getHttpClient();

        this.http.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl(environment.NODE_API_URL);
        });
    }

    kycStatus(username: string) {
        this.http.fetch('kyc/status', {
            method: 'POST',
            body: json({
                username
            })
        })
    }
}
