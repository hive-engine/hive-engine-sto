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

    async uploadRequest(username: string) {
        const res = await this.http.fetch(`uploadRequestToken/${username}`);

        return await res.json();
    }

    /**
     * Get the KYC status for a logged in user
     * 
     * @param username 
     */
    async kycStatus(username: string) {
        const res = await this.http.fetch('kyc/status', {
            method: 'POST',
            body: json({
                username
            })
        });

        return await res.json();
    }

    /**
     * Upload KYC data to the server for a specific user
     * 
     * @param username 
     * @param body 
     */
    async kycUpload(username: string, body: any) {
        const res = await this.http.fetch('kyc/submit', {
            method: 'POST',
            body: json({
                username,
                ...body
            })
        });

        return await res.json();
    }

    /**
     * Update KYC data to the server for a specific user
     * 
     * @param username 
     * @param body 
     */
    async kycUpdate(username: string, body: any) {
        const res = await this.http.fetch('kyc/save', {
            method: 'POST',
            body: json({
                username,
                ...body
            })
        });

        return await res.json();
    }
}
