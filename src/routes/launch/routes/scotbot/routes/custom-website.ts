import { HttpClient, json } from 'aurelia-fetch-client';
import { BootstrapFormRenderer } from 'resources/bootstrap-form-renderer';
import { autoinject, newInstance, lazy } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationController, ControllerValidateResult, ValidationRules } from 'aurelia-validation';
import { SteemEngine } from 'services/steem-engine';
import environment from 'environment';

@autoinject()
export class CustomWebsite {
    private environment = environment;
    private controller: ValidationController;
    private renderer: BootstrapFormRenderer;
    private interval;
    private formSubmitted = false;

    private http: HttpClient;
    private api: HttpClient;

    private url: string;
    private logo: string;
    private email: string;
    private discordUsername: string;

    // Fallback if the API cannot return a price
    private ENG_FEE = '650.000';

    constructor(private controllerFactory: ValidationControllerFactory, private se: SteemEngine, 
        @lazy(HttpClient) private getHttpClient: () => HttpClient) {
        this.controller = controllerFactory.createForCurrentScope();

        this.renderer = new BootstrapFormRenderer();

        this.controller.addRenderer(this.renderer);

        this.http = getHttpClient();
        this.api = getHttpClient();

        this.http.configure(config => {
            config
                .useStandardConfiguration();
        });

        this.api.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl(environment.NODE_API_URL);
        });
    }

    async activate() {
        await this.getPrice();
    }

    async bind() {
        this.interval = setInterval(this.getPrice, 60 * 1000)
    }

    unbind() {
        clearInterval(this.interval);
    }
    
    async getPrice() {
        try {
            const req = await this.http.fetch(environment.PRICE_API);
            const price = await req.json();
            
            const fee = Math.round(environment.NITROUS.FEE / parseFloat(price.steem_price));

            if (fee > 0) {
                this.ENG_FEE = fee.toFixed(3)
            }
        } catch {

        }
    }

    async sendFee() {
        const validator: ControllerValidateResult = await this.controller.validate();

        if (validator.valid) {
            window.steem_keychain.requestSendToken(localStorage.getItem('username'), environment.NITROUS.FEE_ACCOUNT, this.ENG_FEE, 'Nitrous fee', 'ENG', async response => {
                if (response.success) {
                    try {
                        await this.api.fetch('customWebsite', {
                            method: 'POST',
                            body: json({
                                url: this.url,
                                logo: this.logo,
                                email: this.email,
                                discordUsername: this.discordUsername
                            })
                        });
            
                        this.formSubmitted = true;
                    } catch (e) {
                        return;
                    }
                }
            });
        }
    }
}

ValidationRules
    .ensure('url').required().withMessageKey('cwUrl')
    .ensure('logo').required().withMessageKey('cwLogo')
    .ensure('email').required().withMessageKey('emailAddress')
    .ensure('discordUsername').required().withMessageKey('discordUsername')
    .on(CustomWebsite);
