import { HttpClient } from 'aurelia-fetch-client';
import { BootstrapFormRenderer } from 'resources/bootstrap-form-renderer';
import { autoinject, newInstance } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationController, ControllerValidateResult } from 'aurelia-validation';
import { SteemEngine } from 'services/steem-engine';
import environment from 'environment';

@autoinject()
export class CustomWebsite {
    private environment = environment;
    private controller: ValidationController;
    private renderer: BootstrapFormRenderer;
    private interval;

    private url: string;
    private logo: string;
    private email: string;
    private discordUsername: string;

    // Fallback if the API cannot return a price
    private ENG_FEE = '650.000';

    constructor(private controllerFactory: ValidationControllerFactory, private se: SteemEngine, @newInstance() private http: HttpClient) {
        this.controller = controllerFactory.createForCurrentScope();

        this.renderer = new BootstrapFormRenderer();

        this.controller.addRenderer(this.renderer);

        this.http.configure(config => {
            config
                .useStandardConfiguration();
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
            
        }
    }
}
